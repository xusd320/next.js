/* eslint-env jest */
import cheerio from 'cheerio'
import { remove } from 'fs-extra'
import {
  nextBuild,
  File,
  findPort,
  nextStart,
  killApp,
  fetchViaHTTP,
  renderViaHTTP,
} from 'next-test-utils'
import { join } from 'path'

const fixturesDir = join(__dirname, '../..', 'css-fixtures')

describe('Basic Global Support', () => {
  ;(process.env.TURBOPACK_DEV ? describe.skip : describe)(
    'production mode',
    () => {
      let appPort
      let app
      const appDir = join(fixturesDir, 'single-global')
      const nextConfig = new File(join(appDir, 'next.config.js'))

      describe.each([true, false])(`useLightnincsss(%s)`, (useLightningcss) => {
        beforeAll(async () => {
          nextConfig.write(
            `
const config = require('../next.config.js');
module.exports = {
  ...config,
  experimental: {
    useLightningcss: ${useLightningcss}
  }
}`
          )
        })

        beforeAll(async () => {
          await remove(join(appDir, '.next'))
          const { code } = await nextBuild(appDir)
          if (code !== 0) {
            throw new Error('Failed to build')
          }

          appPort = await findPort()
          app = await nextStart(appDir, appPort)
        })

        afterAll(async () => {
          await killApp(app)
        })

        it(`should've emitted a single CSS file`, async () => {
          const content = await renderViaHTTP(appPort, '/')
          const $ = cheerio.load(content)

          const cssSheet = $('link[rel="stylesheet"]')
          const cssContent = await getStylesheetContents($, appPort, cssSheet)

          if (process.env.IS_TURBOPACK_TEST && useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/chunks/HASH.css:
             .red-text{color:red}",
             ]
            `)
          } else if (process.env.IS_TURBOPACK_TEST && !useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/chunks/HASH.css:
             .red-text{color:red}",
             ]
            `)
          } else if (useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/css/HASH.css:
             .red-text{color:red}",
             ]
            `)
          } else {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/css/HASH.css:
             .red-text{color:red}",
             ]
            `)
          }
        })
      })
    }
  )
})

describe('Basic Global Support with special characters in path', () => {
  ;(process.env.TURBOPACK_DEV ? describe.skip : describe)(
    'production mode',
    () => {
      let appPort
      let app
      const appDir = join(
        fixturesDir,
        'single-global-special-characters',
        'a+b'
      )
      const nextConfig = new File(join(appDir, 'next.config.js'))

      describe.each([true, false])(`useLightnincsss(%s)`, (useLightningcss) => {
        beforeAll(async () => {
          nextConfig.write(
            `
const config = require('../../next.config.js');
module.exports = {
  ...config,
  experimental: {
    useLightningcss: ${useLightningcss}
  }
}`
          )
        })

        beforeAll(async () => {
          await remove(join(appDir, '.next'))
          const { code } = await nextBuild(appDir)
          if (code !== 0) {
            throw new Error('Failed to build')
          }

          appPort = await findPort()
          app = await nextStart(appDir, appPort)
        })

        afterAll(async () => {
          await killApp(app)
        })

        it(`should've emitted a single CSS file`, async () => {
          const content = await renderViaHTTP(appPort, '/')
          const $ = cheerio.load(content)

          const cssSheet = $('link[rel="stylesheet"]')
          const cssContent = await getStylesheetContents($, appPort, cssSheet)

          if (process.env.IS_TURBOPACK_TEST && useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/chunks/HASH.css:
             .red-text{color:red}",
             ]
            `)
          } else if (process.env.IS_TURBOPACK_TEST && !useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/chunks/HASH.css:
             .red-text{color:red}",
             ]
            `)
          } else if (useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/css/HASH.css:
             .red-text{color:red}",
             ]
            `)
          } else {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/css/HASH.css:
             .red-text{color:red}",
             ]
            `)
          }
        })
      })
    }
  )
})

describe('Basic Global Support with src/ dir', () => {
  ;(process.env.TURBOPACK_DEV ? describe.skip : describe)(
    'production mode',
    () => {
      let appPort
      let app
      const appDir = join(fixturesDir, 'single-global-src')
      const nextConfig = new File(join(appDir, 'next.config.js'))

      describe.each([true, false])(`useLightnincsss(%s)`, (useLightningcss) => {
        beforeAll(async () => {
          nextConfig.write(
            `
const config = require('../next.config.js');
module.exports = {
  ...config,
  experimental: {
    useLightningcss: ${useLightningcss}
  }
}`
          )
        })

        beforeAll(async () => {
          await remove(join(appDir, '.next'))
          const { code } = await nextBuild(appDir)
          if (code !== 0) {
            throw new Error('Failed to build')
          }

          appPort = await findPort()
          app = await nextStart(appDir, appPort)
        })

        afterAll(async () => {
          await killApp(app)
        })
        it(`should've emitted a single CSS file`, async () => {
          const content = await renderViaHTTP(appPort, '/')
          const $ = cheerio.load(content)

          const cssSheet = $('link[rel="stylesheet"]')
          const cssContent = await getStylesheetContents($, appPort, cssSheet)

          if (process.env.IS_TURBOPACK_TEST && useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/chunks/HASH.css:
             .red-text{color:red}",
             ]
            `)
          } else if (process.env.IS_TURBOPACK_TEST && !useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/chunks/HASH.css:
             .red-text{color:red}",
             ]
            `)
          } else if (useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/css/HASH.css:
             .red-text{color:red}",
             ]
            `)
          } else {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/css/HASH.css:
             .red-text{color:red}",
             ]
            `)
          }
        })
      })
    }
  )
})

describe('Multi Global Support', () => {
  ;(process.env.TURBOPACK_DEV ? describe.skip : describe)(
    'production mode',
    () => {
      let appPort
      let app
      const appDir = join(fixturesDir, 'multi-global')
      const nextConfig = new File(join(appDir, 'next.config.js'))

      describe.each([true, false])(`useLightnincsss(%s)`, (useLightningcss) => {
        beforeAll(async () => {
          nextConfig.write(
            `
const config = require('../next.config.js');
module.exports = {
  ...config,
  experimental: {
    useLightningcss: ${useLightningcss}
  }
}`
          )
        })

        beforeAll(async () => {
          await remove(join(appDir, '.next'))
          const { code } = await nextBuild(appDir)
          if (code !== 0) {
            throw new Error('Failed to build')
          }

          appPort = await findPort()
          app = await nextStart(appDir, appPort)
        })

        afterAll(async () => {
          await killApp(app)
        })

        it(`should've emitted a single CSS file`, async () => {
          const content = await renderViaHTTP(appPort, '/')
          const $ = cheerio.load(content)

          const cssSheet = $('link[rel="stylesheet"]')
          const cssContent = await getStylesheetContents($, appPort, cssSheet)

          if (process.env.IS_TURBOPACK_TEST && useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/chunks/HASH.css:
             .red-text{color:red}

             .blue-text{color:#00f}",
             ]
            `)
          } else if (process.env.IS_TURBOPACK_TEST && !useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/chunks/HASH.css:
             .red-text{color:red}

             .blue-text{color:#00f}",
             ]
            `)
          } else if (useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/css/HASH.css:
             .red-text{color:red}.blue-text{color:#00f}",
             ]
            `)
          } else {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/css/HASH.css:
             .red-text{color:red}.blue-text{color:blue}",
             ]
            `)
          }
        })
      })
    }
  )
})

describe('Nested @import() Global Support', () => {
  ;(process.env.TURBOPACK_DEV ? describe.skip : describe)(
    'production mode',
    () => {
      let appPort
      let app
      const appDir = join(fixturesDir, 'nested-global')
      const nextConfig = new File(join(appDir, 'next.config.js'))

      describe.each([true, false])(`useLightnincsss(%s)`, (useLightningcss) => {
        beforeAll(async () => {
          nextConfig.write(
            `
const config = require('../next.config.js');
module.exports = {
  ...config,
  experimental: {
    useLightningcss: ${useLightningcss}
  }
}`
          )
        })

        beforeAll(async () => {
          await remove(join(appDir, '.next'))
          const { code } = await nextBuild(appDir)
          if (code !== 0) {
            throw new Error('Failed to build')
          }

          appPort = await findPort()
          app = await nextStart(appDir, appPort)
        })

        afterAll(async () => {
          await killApp(app)
        })

        it(`should've emitted a single CSS file`, async () => {
          const content = await renderViaHTTP(appPort, '/')
          const $ = cheerio.load(content)

          const cssSheet = $('link[rel="stylesheet"]')
          const cssContent = await getStylesheetContents($, appPort, cssSheet)

          if (process.env.IS_TURBOPACK_TEST && useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/chunks/HASH.css:
             .red-text{color:purple;font-weight:bolder}

             .red-text{color:red}

             .blue-text{color:orange;font-weight:bolder}

             .blue-text{color:#00f}",
             ]
            `)
          } else if (process.env.IS_TURBOPACK_TEST && !useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/chunks/HASH.css:
             .red-text{color:purple;font-weight:bolder}

             .red-text{color:red}

             .blue-text{color:orange;font-weight:bolder}

             .blue-text{color:#00f}",
             ]
            `)
          } else if (useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/css/HASH.css:
             .red-text{color:purple;font-weight:bolder;color:red}.blue-text{color:orange;font-weight:bolder;color:#00f}",
             ]
            `)
          } else {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/css/HASH.css:
             .red-text{color:purple;font-weight:bolder;color:red}.blue-text{color:orange;font-weight:bolder;color:blue}",
             ]
            `)
          }
        })
      })
    }
  )
})

// Tests css ordering
describe('Multi Global Support (reversed)', () => {
  ;(process.env.TURBOPACK_DEV ? describe.skip : describe)(
    'production mode',
    () => {
      let appPort
      let app
      const appDir = join(fixturesDir, 'multi-global-reversed')
      const nextConfig = new File(join(appDir, 'next.config.js'))

      describe.each([true, false])(`useLightnincsss(%s)`, (useLightningcss) => {
        beforeAll(async () => {
          nextConfig.write(
            `
const config = require('../next.config.js');
module.exports = {
  ...config,
  experimental: {
    useLightningcss: ${useLightningcss}
  }
}`
          )
        })

        beforeAll(async () => {
          await remove(join(appDir, '.next'))
          const { code } = await nextBuild(appDir)
          if (code !== 0) {
            throw new Error('Failed to build')
          }

          appPort = await findPort()
          app = await nextStart(appDir, appPort)
        })

        afterAll(async () => {
          await killApp(app)
        })

        it(`should've emitted a single CSS file`, async () => {
          const content = await renderViaHTTP(appPort, '/')
          const $ = cheerio.load(content)

          const cssSheet = $('link[rel="stylesheet"]')
          const cssContent = await getStylesheetContents($, appPort, cssSheet)

          if (process.env.IS_TURBOPACK_TEST && useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/chunks/HASH.css:
             .blue-text{color:#00f}

             .red-text{color:red}",
             ]
            `)
          } else if (process.env.IS_TURBOPACK_TEST && !useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/chunks/HASH.css:
             .blue-text{color:#00f}

             .red-text{color:red}",
             ]
            `)
          } else if (useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/css/HASH.css:
             .blue-text{color:#00f}.red-text{color:red}",
             ]
            `)
          } else {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/css/HASH.css:
             .blue-text{color:blue}.red-text{color:red}",
             ]
            `)
          }
        })
      })
    }
  )
})

describe('CSS URL via `file-loader`', () => {
  ;(process.env.TURBOPACK_DEV ? describe.skip : describe)(
    'production mode',
    () => {
      let appPort
      let app
      const appDir = join(fixturesDir, 'url-global')
      const nextConfig = new File(join(appDir, 'next.config.js'))

      describe.each([true, false])(`useLightnincsss(%s)`, (useLightningcss) => {
        beforeAll(async () => {
          nextConfig.write(
            `
const config = require('../next.config.js');
module.exports = {
  ...config,
  experimental: {
    useLightningcss: ${useLightningcss}
  }
}`
          )
        })

        beforeAll(async () => {
          await remove(join(appDir, '.next'))
          const { code } = await nextBuild(appDir)
          if (code !== 0) {
            throw new Error('Failed to build')
          }

          appPort = await findPort()
          app = await nextStart(appDir, appPort)
        })

        afterAll(async () => {
          await killApp(app)
        })

        it(`should've emitted expected files`, async () => {
          const content = await renderViaHTTP(appPort, '/')
          const $ = cheerio.load(content)

          const cssSheet = $('link[rel="stylesheet"]')
          const cssContent = await getStylesheetContents($, appPort, cssSheet)

          if (process.env.IS_TURBOPACK_TEST && useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/chunks/HASH.css:
             .red-text{color:red;background-image:url(../media/dark.993bedd3.svg),url(../media/dark2.993bedd3.svg)}

             .blue-text{color:orange;background-image:url(../media/light.180573e4.svg);font-weight:bolder}

             .blue-text{color:#00f}",
             ]
            `)
          } else if (process.env.IS_TURBOPACK_TEST && !useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/chunks/HASH.css:
             .red-text{color:red;background-image:url(../media/dark.993bedd3.svg),url(../media/dark2.993bedd3.svg)}

             .blue-text{color:orange;background-image:url(../media/light.180573e4.svg);font-weight:bolder}

             .blue-text{color:#00f}",
             ]
            `)
          } else if (useLightningcss) {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/css/HASH.css:
             .red-text{color:red;background-image:url(/_next/static/media/dark.6b01655b.svg),url(/_next/static/media/dark2.6b01655b.svg)}.blue-text{color:orange;background-image:url(/_next/static/media/light.2da1d3d6.svg);font-weight:bolder;color:#00f}",
             ]
            `)
          } else {
            expect(cssContent).toMatchInlineSnapshot(`
             [
               "/_next/static/css/HASH.css:
             .red-text{color:red;background-image:url(/_next/static/media/dark.6b01655b.svg),url(/_next/static/media/dark2.6b01655b.svg)}.blue-text{color:orange;font-weight:bolder;background-image:url(/_next/static/media/light.2da1d3d6.svg);color:blue}",
             ]
            `)
          }
        })
      })
    }
  )
})

describe('CSS URL via `file-loader` and asset prefix (1)', () => {
  ;(process.env.TURBOPACK_DEV ? describe.skip : describe)(
    'production mode',
    () => {
      let appPort
      let app
      const appDir = join(fixturesDir, 'url-global-asset-prefix-1')

      beforeAll(async () => {
        await remove(join(appDir, '.next'))
        const { code } = await nextBuild(appDir)
        if (code !== 0) {
          throw new Error('Failed to build')
        }

        appPort = await findPort()
        app = await nextStart(appDir, appPort)
      })

      afterAll(async () => {
        await killApp(app)
      })

      it(`should've emitted expected files`, async () => {
        const content = await renderViaHTTP(appPort, '/')
        const $ = cheerio.load(content)

        const cssSheet = $('link[rel="stylesheet"]')
        const cssContent = await getStylesheetContents($, appPort, cssSheet)

        if (process.env.IS_TURBOPACK_TEST) {
          expect(cssContent).toMatchInlineSnapshot(`
           [
             "/_next/static/chunks/HASH.css:
           .red-text{color:red;background-image:url(../media/dark.993bedd3.svg) url(../media/dark2.993bedd3.svg)}

           .blue-text{color:orange;background-image:url(../media/light.180573e4.svg);font-weight:bolder}

           .blue-text{color:#00f}",
           ]
          `)
        } else {
          expect(cssContent).toMatchInlineSnapshot(`
           [
             "/_next/static/css/HASH.css:
           .red-text{color:red;background-image:url(/foo/_next/static/media/dark.6b01655b.svg) url(/foo/_next/static/media/dark2.6b01655b.svg)}.blue-text{color:orange;font-weight:bolder;background-image:url(/foo/_next/static/media/light.2da1d3d6.svg);color:blue}",
           ]
          `)
        }
      })
    }
  )
})

describe('CSS URL via `file-loader` and asset prefix (2)', () => {
  ;(process.env.TURBOPACK_DEV ? describe.skip : describe)(
    'production mode',
    () => {
      let appPort
      let app
      const appDir = join(fixturesDir, 'url-global-asset-prefix-2')

      beforeAll(async () => {
        await remove(join(appDir, '.next'))
        const { code } = await nextBuild(appDir)
        if (code !== 0) {
          throw new Error('Failed to build')
        }

        appPort = await findPort()
        app = await nextStart(appDir, appPort)
      })

      afterAll(async () => {
        await killApp(app)
      })

      it(`should've emitted expected files`, async () => {
        const content = await renderViaHTTP(appPort, '/')
        const $ = cheerio.load(content)

        const cssSheet = $('link[rel="stylesheet"]')
        const cssContent = await getStylesheetContents($, appPort, cssSheet)

        if (process.env.IS_TURBOPACK_TEST) {
          expect(cssContent).toMatchInlineSnapshot(`
           [
             "/_next/static/chunks/HASH.css:
           .red-text{color:red;background-image:url(../media/dark.993bedd3.svg) url(../media/dark2.993bedd3.svg)}

           .blue-text{color:orange;background-image:url(../media/light.180573e4.svg);font-weight:bolder}

           .blue-text{color:#00f}",
           ]
          `)
        } else {
          expect(cssContent).toMatchInlineSnapshot(`
           [
             "/_next/static/css/HASH.css:
           .red-text{color:red;background-image:url(/foo/_next/static/media/dark.6b01655b.svg) url(/foo/_next/static/media/dark2.6b01655b.svg)}.blue-text{color:orange;font-weight:bolder;background-image:url(/foo/_next/static/media/light.2da1d3d6.svg);color:blue}",
           ]
          `)
        }
      })
    }
  )
})

async function getStylesheetContents($, appPort, items) {
  const results = []
  for (let i = 0; i < items.length; i++) {
    const item = $(items[i])
    const href = item.attr('href').replace(/^\/foo\//, '/')
    const res = await fetchViaHTTP(appPort, href)
    if (res.status !== 200)
      throw new Error(`Failed to load stylesheet: ${href}`)
    const text = await res.text()
    results.push(
      `${href.replace(
        /[0-9a-f]{8,}/g,
        'HASH'
      )}:\n${text.replace(/\/\*.*?\*\/\n?/g, '').trim()}`
    )
  }
  return results
}
