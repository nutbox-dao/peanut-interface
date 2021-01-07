const webpack = require('webpack')

module.exports = {
    outputDir: "nutbox-mainnet",
    configureWebpack:{
        plugins:[
            new webpack.BannerPlugin({
                banner:'nutbox copyright.'
            })
        ]
    }
}