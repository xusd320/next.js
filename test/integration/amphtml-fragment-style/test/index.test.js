/* eslint-env jest */

import { join } from 'path'
import cheerio from 'cheerio'
import { validateAMP } from 'amp-test-utils'
import {
  nextBuild,
  renderViaHTTP,
  nextStart,
  findPort,
  killApp,
} from 'next-test-utils'

const appDir = join(__dirname, '../')
let appPort
let app

  // Turbopack does not support AMP rendering.
;(process.env.IS_TURBOPACK_TEST ? describe.skip : describe)(
  'AMP Fragment Styles',
  () => {
    describe('production mode', () => {
      beforeAll(async () => {
        await nextBuild(appDir, [])
        appPort = await findPort()
        app = await nextStart(appDir, appPort)
      })
      afterAll(() => killApp(app))

      it('adds styles from fragment in AMP mode correctly', async () => {
        const html = await renderViaHTTP(appPort, '/', { amp: 1 })
        await validateAMP(html)
        const $ = cheerio.load(html)
        const styles = $('style[amp-custom]').text()
        expect(styles).toMatch(/background:(.*|)hotpink/)
        expect(styles).toMatch(/font-size:(.*|)16\.4px/)
      })
    })
  }
)
