// offline ga init
workbox.googleAnalytics.initialize();

// 引入预缓存列表（precacheManifest 是workbox自动生成的）
workbox.precaching.precacheAndRoute(
  self.__precacheManifest || [], {
    ignoreUrlParametersMatching: [/./],
    cleanUrls: false,
  }
);

// 本地图片
workbox.routing.registerRoute(
  new RegExp('/static/img/'),
  workbox.strategies.cacheFirst({
    // Use a custom cache name
    cacheName: 'static-img-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        // Cache only 50 images
        maxEntries: 50,
      })
    ],
  })
)

// CDN图片缓存
workbox.routing.registerRoute(
  new RegExp('^https://d1vs5f.XXXX.net/'),
  workbox.strategies.cacheFirst({
    cacheName: 'cdn-images-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 300,
        // Cache for a maximum of a week
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ]
  }),
)

// workbox-cdn
workbox.routing.registerRoute(
  new RegExp('^https://storage.googleapis.com/workbox-cdn/releases/'),
  workbox.strategies.cacheFirst({
    cacheName: 'workbox-cdn',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 10
      })
    ]
  })
)

// iconfont
workbox.routing.registerRoute(
  new RegExp('^https://m.cfcdn.club/static/icons'),
  workbox.strategies.cacheFirst({
    cacheName: 'icons-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 50
      })
    ],
  })
)

// 其他静态资源：cacheFirst
workbox.routing.registerRoute(
  new RegExp('/static/'),
  workbox.strategies.cacheFirst({
    cacheName: 'server-static',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 50
      })
    ]
  })
)

// get接口请求: networkFirst
workbox.routing.registerRoute(
  new RegExp('/api/'),
  workbox.strategies.networkFirst({
    cacheName: 'api-cache',
  })
)

// html: networkFirst
const routerName = ["home","product","payment","account","service","orders","order","categories","cart","size","search","reviews","cod","trackinginfo","forgot","resetpassword"];
workbox.routing.registerRoute(
  // new RegExp('/')
  new RegExp('/('+routerName.join("|")+')(?!(.html|.html?.*))'),
  workbox.strategies.networkFirst({
    cacheName: 'url-cache',
  })
)
