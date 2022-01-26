import { configure } from 'log4js'
import { start } from './src'

configure('./log4js.config.json')

start()
