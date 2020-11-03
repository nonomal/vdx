/* eslint-disable no-console */
import * as childProcess from 'child_process'
import * as kleur from 'kleur'
import * as pAll from 'p-all'

import { escapeFilePath } from './escape-file-path'
import { FFmpegShellCommand } from './types'

export async function executeShellCommands(
  shellCommands: Array<FFmpegShellCommand>,
  concurrency: number,
  debug: boolean
): Promise<void> {
  if (debug === true) {
    for (const { shellCommand } of shellCommands) {
      console.log(kleur.gray(shellCommand))
    }
  }
  const callbacks = shellCommands.map(function ({
    inputFile,
    outputFile,
    shellCommand
  }) {
    return function () {
      return new Promise(function (resolve, reject) {
        childProcess.exec(shellCommand, function (error) {
          if (error) {
            reject(error)
            return
          }
          console.log(
            `${kleur.green('✔')} ${escapeFilePath(inputFile)} ${kleur.gray(
              '›'
            )} ${escapeFilePath(outputFile)}`
          )
          resolve()
        })
      })
    }
  })
  await pAll(callbacks, { concurrency })
}
