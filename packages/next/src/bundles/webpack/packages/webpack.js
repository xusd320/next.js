exports.__esModule = true

exports.default = undefined

exports.init = function () {
  if (process.env.NEXT_RSPACK) {
    // eslint-disable-next-line
    Object.assign(exports, getRspackCore())
    Object.assign(exports, {
      // eslint-disable-next-line import/no-extraneous-dependencies
      StringXor: require('./bundle5')().StringXor,
    })
  } else if (process.env.NEXT_PRIVATE_LOCAL_WEBPACK) {
    Object.assign(exports, {
      // eslint-disable-next-line import/no-extraneous-dependencies
      BasicEvaluatedExpression: require('webpack/lib/javascript/BasicEvaluatedExpression'),
      // eslint-disable-next-line import/no-extraneous-dependencies
      ConcatenatedModule: require('webpack/lib/optimize/ConcatenatedModule'),
      // eslint-disable-next-line import/no-extraneous-dependencies
      makePathsAbsolute: require('webpack/lib/util/identifier')
        .makePathsAbsolute,
      // eslint-disable-next-line import/no-extraneous-dependencies
      ModuleFilenameHelpers: require('webpack/lib/ModuleFilenameHelpers'),
      // eslint-disable-next-line import/no-extraneous-dependencies
      NodeTargetPlugin: require('webpack/lib/node/NodeTargetPlugin'),
      // eslint-disable-next-line import/no-extraneous-dependencies
      RuntimeGlobals: require('webpack/lib/RuntimeGlobals'),
      // eslint-disable-next-line import/no-extraneous-dependencies
      SourceMapDevToolModuleOptionsPlugin: require('webpack/lib/SourceMapDevToolModuleOptionsPlugin'),
      // eslint-disable-next-line import/no-extraneous-dependencies
      StringXor: require('webpack/lib/util/StringXor'),
      // eslint-disable-next-line import/no-extraneous-dependencies
      NormalModule: require('webpack/lib/NormalModule'),
      // eslint-disable-next-line import/no-extraneous-dependencies
      sources: require('webpack').sources,
      // eslint-disable-next-line import/no-extraneous-dependencies
      webpack: require('webpack'),
    })
  } else {
    Object.assign(exports, require('./bundle5')())
  }
}

function getRspackCore() {
  try {
    // eslint-disable-next-line import/no-extraneous-dependencies
    return require('@rspack/core')
  } catch (e) {
    if (e instanceof Error && 'code' in e && e.code === 'MODULE_NOT_FOUND') {
      throw new Error(
        '@rspack/core is not available. Please make sure the appropriate Next.js plugin is installed.'
      )
    }

    throw e
  }
}
