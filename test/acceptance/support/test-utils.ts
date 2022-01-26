
import fs from 'fs'
import md5 from 'md5'
import path from 'path'

export class TestUtils {
  public static hashImage(imageData: Buffer): string {
    return md5(imageData)
  }

  public static readImageFromFile(imageFileName: string): Buffer {
    return fs.readFileSync(path.join(__dirname, '..', '/resources/', imageFileName))
  }
}
