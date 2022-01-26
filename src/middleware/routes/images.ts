import 'dotenv/config'
import { ImageManager, ImageRatingDirection } from '../../utils'
import express, { Router } from 'express'
import fileUpload, { UploadedFile } from 'express-fileupload'
import fileType from 'file-type'
import { getLogger } from 'log4js'

const logger = getLogger('routes.images')

export const registerImagesRoute = (router: Router, imageManager: ImageManager): void => {
  router.use(express.json())

  router.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    limitHandler: (req, res) => {
      return res.status(400).json({ message: 'File too large' })
    },
  }))

  router.route('/images')
    .get(async function(req, res) {
      try {
        const images = await imageManager.getImageList()
        return res.json(images.map(uuid => { return { uuid } }))
      } catch (err) {
        logger.error(err)
        return res.status(500).json({ message:'Could not list images, try again later' })
      }
    })
    .post(async function(req, res) {
      logger.info(req.headers)
      if (!req.files || !req.files.image || Array.isArray(req.files.image)) {
        return res.status(400).json({ message: 'Image missing in request' })
      }

      logger.info(req.files)
      const image: UploadedFile = req.files.image
      const type = await fileType.fromBuffer(image.data)
      if (!type || !type.mime.startsWith('image/')) {
        return res.status(400).json({ message: 'File is not an image' })
      }

      try {
        const uuid = await imageManager.saveImage(image.data, image.size)
        return res.status(201).json({ uuid })
      } catch (err) {
        logger.error(err)
        return res.status(500).json({ message: 'Could not upload image, try again later' })
      }
    })


  router.all(['/images/:uuid', '/images/:uuid/rating'], async function(req, res, next) {
    const uuid = req.params.uuid
    const hasImage = await imageManager.hasImage(uuid)
    if (!hasImage) {
      return res.status(404).json({ message: 'An image with the specified UUID could not be found' })
    }
    return next()
  })

  router.get('/images/:uuid', async function(req, res) {
    try {
      const uuid = req.params.uuid
      const stream = await imageManager.loadImage(uuid)
      return stream.pipe(res)
    } catch (err) {
      logger.error(err)
      return res.status(500).json({ message: 'Could not download image, try again later' })
    }
  })

  router.route('/images/:uuid/rating')
    .get(async function(req, res) {
      try {
        const uuid = req.params.uuid
        const rating = await imageManager.getImageRating(uuid)
        return res.json({ rating })
      } catch (err) {
        logger.error(err)
        return res.status(500).json({ message: 'Could not retrieve image rating, try again later' })
      }
    })
    .post(async function(req, res) {
      try {
        const uuid = req.params.uuid
        const direction = req.body.direction
        if (!direction || !(Object.values(ImageRatingDirection).includes(direction))) {
          return res.status(400).json({ message: 'Invalid rating direction' })
        }
        const imageRatingDirection = direction as ImageRatingDirection
        const newRating = await imageManager.rateImage(uuid, imageRatingDirection)
        return res.json({ rating: newRating })
      } catch (err) {
        logger.error(err)
        return res.status(500).send('Could not rate image, try again later')
      }
    })
}
