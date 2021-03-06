export type Options = {
  crop: null | CropOption
  debug: boolean
  format: null | string
  fps: null | number
  output: string
  parallel: number
  resize: null | ResizeOption
  reverse: boolean
  rotate: null | RotateOption
  speed: null | number
  trim: null | TrimOption
  volume: null | number
}

export type CropOption = { height: string; width: string; x: string; y: string }
export type ResizeOption = { height: string; width: string }
export type RotateOption = '-90' | '90' | '180'
export type TrimOption = { endTimestamp: null | string; startTimestamp: string }

export type FFmpegFlags = {
  'an': null | boolean
  'codec:a': null | 'copy'
  'codec:v': null | 'copy'
  'filter:a': Array<string>
  'filter:v': Array<string>
  'i': string
  'ss': null | string
  'to': null | string
}

export type FFmpegShellCommand = {
  inputFile: string
  outputFile: string
  shellCommand: string
}
