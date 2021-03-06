import * as path from 'path'

import { FFmpegFlags, Options } from '../../types'
import { formatFloat } from './utilities/format-float'
import { mapRotateOptionToVideoFilter } from './utilities/map-rotate-option-to-video-filter'
import { mapSpeedOptionToAudioFilter } from './utilities/map-speed-option-to-audio-filter'
import { mapSpeedOptionToVideoFilter } from './utilities/map-speed-option-to-video-filter'

export function createFFmpegFlags(
  inputFile: string,
  {
    crop,
    format,
    fps,
    resize,
    reverse,
    rotate,
    speed,
    trim,
    volume
  }: Omit<Options, 'parallel' | 'debug' | 'output'>
): FFmpegFlags {
  const flags: FFmpegFlags = {
    'an': null,
    'codec:a': 'copy',
    'codec:v': 'copy',
    'filter:a': [],
    'filter:v': [],
    'i': inputFile,
    'ss': null,
    'to': null
  }
  const originalFormat = path.extname(inputFile).slice(1)
  const isGif = originalFormat === 'gif' || format === 'gif'
  if (crop !== null) {
    flags['codec:v'] = null
    flags['filter:v'].push(
      `crop=${crop.width}:${crop.height}:${crop.x}:${crop.y}`
    )
  }
  if (fps !== null) {
    flags['codec:v'] = null
    flags['filter:v'].push(`fps=fps=${fps}`)
  }
  if (resize !== null) {
    flags['codec:v'] = null
    flags['filter:v'].push(`scale=${resize.width}:${resize.height}`)
  }
  if (reverse === true) {
    flags['codec:a'] = null
    flags['codec:v'] = null
    flags['filter:a'].push('areverse')
    flags['filter:v'].push('reverse')
  }
  if (rotate !== null) {
    flags['codec:v'] = null
    flags['filter:v'].push(mapRotateOptionToVideoFilter(rotate))
  }
  if (speed !== null && speed !== 1) {
    flags['codec:a'] = null
    flags['codec:v'] = null
    flags['filter:a'].push(mapSpeedOptionToAudioFilter(speed))
    flags['filter:v'].push(mapSpeedOptionToVideoFilter(speed))
  }
  if (trim !== null) {
    flags['ss'] = trim.startTimestamp
    flags['to'] = trim.endTimestamp
  }
  if (volume !== null && volume !== 1) {
    flags['codec:a'] = null
    if (volume === 0) {
      flags['an'] = true
      flags['filter:a'] = []
    } else {
      flags['filter:a'].push(`volume=${formatFloat(volume)}`)
    }
  }
  if (isGif === true) {
    flags['an'] = null
    flags['codec:a'] = null
    flags['codec:v'] = null
    flags['filter:a'] = []
  }
  return flags
}
