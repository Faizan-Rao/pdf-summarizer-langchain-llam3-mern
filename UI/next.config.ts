module.exports = {
    async rewrites() {
       return [
         {
            source: '/v1/:path*',
            destination: 'http://localhost:7000/:path*'
         },
         {
            source: '/:path*',
            destination: 'http://localhost:7001/:path*'
         }
      ]
  }
}