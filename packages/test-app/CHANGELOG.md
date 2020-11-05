# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.9.1 (2020-11-05)


### Bug Fixes

* add additional url validation ([1b67fbd](https://github.com/blockstack/ux/commit/1b67fbd91d0eb3cbfabfed297b9e18dfd7ab497b))





# 1.9.0 (2020-11-04)


### Features

* further simplify app instructions ([598827d](https://github.com/blockstack/ux/commit/598827d919fb62f9cc5308ebee5eac6acec4e982))





## 1.8.1 (2020-11-03)


### Bug Fixes

* proper glob for lerna packages ([5367055](https://github.com/blockstack/ux/commit/5367055e9c6622dd0a93f97275ab652a9af56bf9))





# [1.8.0](https://github.com/blockstack/ux/compare/test-app@1.6.7...test-app@1.8.0) (2020-11-02)


### Bug Fixes

* lighter CSP ([fcaed93](https://github.com/blockstack/ux/commit/fcaed93e833b84869f530c0dd5a464b9a97e4f34))
* only build modules for connect-react, not standalone ([a6174a2](https://github.com/blockstack/ux/commit/a6174a2e2a809776bbb1bac3629afa0078692be6))
* stencil publishing tweaks ([db45290](https://github.com/blockstack/ux/commit/db45290e6effbae8e91c9f0d2ab3c9d205cca0f0))


### Features

* refactor connect ui into web components with stencil ([7f65900](https://github.com/blockstack/ux/commit/7f65900fd6f648dcad57502d985b8dc862e7b72f)), closes [#581](https://github.com/blockstack/ux/issues/581) [#604](https://github.com/blockstack/ux/issues/604) [#612](https://github.com/blockstack/ux/issues/612) [#606](https://github.com/blockstack/ux/issues/606) [#613](https://github.com/blockstack/ux/issues/613)
* rename all packages to [@stacks](https://github.com/stacks) ([b56e750](https://github.com/blockstack/ux/commit/b56e750db5b30d4c56e9669285a11db565e8a675))





## [1.7.1](https://github.com/blockstack/ux/compare/test-app@1.7.0...test-app@1.7.1) (2020-11-02)

**Note:** Version bump only for package test-app





# [1.7.0](https://github.com/blockstack/ux/compare/test-app@1.6.7...test-app@1.7.0) (2020-11-02)


### Bug Fixes

* lighter CSP ([fcaed93](https://github.com/blockstack/ux/commit/fcaed93e833b84869f530c0dd5a464b9a97e4f34))
* only build modules for connect-react, not standalone ([a6174a2](https://github.com/blockstack/ux/commit/a6174a2e2a809776bbb1bac3629afa0078692be6))


### Features

* refactor connect ui into web components with stencil ([7f65900](https://github.com/blockstack/ux/commit/7f65900fd6f648dcad57502d985b8dc862e7b72f)), closes [#581](https://github.com/blockstack/ux/issues/581) [#604](https://github.com/blockstack/ux/issues/604) [#612](https://github.com/blockstack/ux/issues/612) [#606](https://github.com/blockstack/ux/issues/606) [#613](https://github.com/blockstack/ux/issues/613)
* rename all packages to [@stacks](https://github.com/stacks) ([b56e750](https://github.com/blockstack/ux/commit/b56e750db5b30d4c56e9669285a11db565e8a675))





## 1.6.7 (2020-10-05)


### Bug Fixes

* **connect:** use authOrigin from authOptions ([e6602a8](https://github.com/blockstack/ux/commit/e6602a8a559158d3ecf92268495176619d1f340e))





## 1.6.6 (2020-10-05)


### Bug Fixes

* remaining broken sidecar urls, fixes [#615](https://github.com/blockstack/ux/issues/615) ([4c26fce](https://github.com/blockstack/ux/commit/4c26fcea34c1603e4ea63d1be7b576b9ccb45a42))





## 1.6.5 (2020-09-29)


### Bug Fixes

* update node api url ([7c71cc7](https://github.com/blockstack/ux/commit/7c71cc7fd47cdb5626d618be70c953f3bfb9d7f7))





## 1.6.4 (2020-09-25)


### Bug Fixes

* add yarn.lock ([24d88d5](https://github.com/blockstack/ux/commit/24d88d5a29d2a4d3d8acee5ce70cd5ecb3c997c4))





## 1.6.3 (2020-09-16)


### Bug Fixes

* keychain lib still broken ([1a7fd0c](https://github.com/blockstack/ux/commit/1a7fd0ced01a6ec8bdd31bf84140728e4b1d7e30))





## 1.6.2 (2020-09-10)


### Bug Fixes

* **keychain:** use correct filepath when writing profiles ([fa8098a](https://github.com/blockstack/ux/commit/fa8098ae13973dd5e53303a4b04967a956d8842b))





## 1.6.1 (2020-08-21)

**Note:** Version bump only for package test-app





# [1.6.0](https://github.com/blockstack/ux/compare/test-app@1.5.6...test-app@1.6.0) (2020-08-21)


### Bug Fixes

* keychain version ([e1618f6](https://github.com/blockstack/ux/commit/e1618f61b18490e87760b810766beab38e7ef16f))
* rpc-client version ([83cf48b](https://github.com/blockstack/ux/commit/83cf48b679fa0938f6550c02472a97400dd009bf))
* **app:** use BigNum for fungible post condition amount ([633ac80](https://github.com/blockstack/ux/commit/633ac801b9a0f2f17eadd2dd302b8c4c235233de))


### Features

* dont use popups in mobile, adds method to handle redirect auth ([450f58b](https://github.com/blockstack/ux/commit/450f58bcb5c3431d6b1ac649d19f319da34d9f7f))





## [1.5.6](https://github.com/blockstack/ux/compare/test-app@1.5.5...test-app@1.5.6) (2020-08-11)

**Note:** Version bump only for package test-app





## 1.5.5 (2020-07-30)


### Bug Fixes

* reset text-align within connect modal, fixes [#458](https://github.com/blockstack/ux/issues/458) ([aecc700](https://github.com/blockstack/ux/commit/aecc70016809c3750d5cde730db4aeaffd52bb98))





## 1.5.4 (2020-07-28)

**Note:** Version bump only for package test-app





## 1.5.3 (2020-07-28)


### Bug Fixes

* cursor pointer on dont show this again, fixes [#508](https://github.com/blockstack/ux/issues/508) ([fe4dcf4](https://github.com/blockstack/ux/commit/fe4dcf418526289685687ad9f4526cd45db85410))





## 1.5.2 (2020-07-27)


### Bug Fixes

* **connect:** pass all data to token ([3f46f60](https://github.com/blockstack/ux/commit/3f46f600cccfeadca381574b2b493709b4bba590))





## 1.5.1 (2020-07-24)


### Bug Fixes

* send to sign in when using showBlockstackConnect, fixes [#507](https://github.com/blockstack/ux/issues/507) ([d7698e8](https://github.com/blockstack/ux/commit/d7698e839e44177e56617701d9df0bca5a60924a))





# 1.5.0 (2020-07-24)


### Features

* better bundle size with esmodules ([2c7046f](https://github.com/blockstack/ux/commit/2c7046f70d2ea10ffd973a4ea816a760ffc26952))





## 1.4.1 (2020-07-24)


### Bug Fixes

* force app icon 100% size in connect modal, fixes [#455](https://github.com/blockstack/ux/issues/455) ([4f69f75](https://github.com/blockstack/ux/commit/4f69f75cf7a153c6511cd200e3d1604e5a049226))





# 1.4.0 (2020-07-23)


### Features

* expose connect, app version ([b90a618](https://github.com/blockstack/ux/commit/b90a618fbeaac0ed998ec5ecd10eda8facdc6e10))





## 1.3.6 (2020-07-22)


### Bug Fixes

* docs not building ([d6acb21](https://github.com/blockstack/ux/commit/d6acb21d6e9d6ca171dbbac13a2cc38e7f68b4b9))





## 1.3.5 (2020-07-22)


### Bug Fixes

* workflow syntax for test-app deployment ([976fe54](https://github.com/blockstack/ux/commit/976fe54ee4e0e28833bad515ceccc5fd7f98df3a))





## 1.3.4 (2020-07-22)

**Note:** Version bump only for package test-app





## 1.3.3 (2020-07-14)


### Bug Fixes

* textStyles not being typed ([2428f69](https://github.com/blockstack/ux/commit/2428f69ddc39f20c566f2686a65959b59f52e9aa))





## 1.3.2 (2020-07-09)

**Note:** Version bump only for package test-app





## 1.3.1 (2020-07-09)

**Note:** Version bump only for package test-app





# 1.3.0 (2020-07-07)


### Features

* add codesandbox ci ([9e903d7](https://github.com/blockstack/ux/commit/9e903d7141c21503339159255cd06fb6701b1e3b))





## 1.2.4 (2020-06-30)

**Note:** Version bump only for package test-app





## [1.2.3](https://github.com/blockstack/ux/compare/test-app@1.2.2...test-app@1.2.3) (2020-06-30)

**Note:** Version bump only for package test-app





## [1.2.2](https://github.com/blockstack/ux/compare/test-app@1.2.1...test-app@1.2.2) (2020-06-30)

**Note:** Version bump only for package test-app





## [1.2.1](https://github.com/blockstack/ux/compare/test-app@1.2.0...test-app@1.2.1) (2020-06-24)


### Bug Fixes

* ui version behind published ([8198ca0](https://github.com/blockstack/ux/commit/8198ca050baa5e7294f99f4521aba78cab7635d8))





# [1.2.0](https://github.com/blockstack/ux/compare/test-app@1.1.12...test-app@1.2.0) (2020-06-24)


### Bug Fixes

* better readme for firefox install ([cbecc86](https://github.com/blockstack/ux/commit/cbecc86e975a9b758260dbb16e3c29a938717d60))
* connect version was behind published ([2d7633e](https://github.com/blockstack/ux/commit/2d7633e8b842cf231f10c2ea032de3bcd67258ff))
* keychain package was behind published version ([acbd4b0](https://github.com/blockstack/ux/commit/acbd4b064db61a60f01ce60ab75f9f2f39456eb8))
* tweaks to get extension working ([e068dce](https://github.com/blockstack/ux/commit/e068dcec1eca8c30375564a748ff3df4f0e8c715))


### Features

* add alternate button, closes [#397](https://github.com/blockstack/ux/issues/397) ([8d248d9](https://github.com/blockstack/ux/commit/8d248d9a7d54504149d90454f671ad54e6319eba))





## [1.1.12](https://github.com/blockstack/ux/compare/test-app@1.1.11...test-app@1.1.12) (2020-06-10)

**Note:** Version bump only for package test-app





## [1.1.11](https://github.com/blockstack/ux/compare/test-app@1.1.10...test-app@1.1.11) (2020-06-07)


### Bug Fixes

* handle mobile auth ([100faed](https://github.com/blockstack/ux/commit/100faed78db94756f13b5b803283fb2538153781))





## [1.1.10](https://github.com/blockstack/ux/compare/test-app@1.1.9...test-app@1.1.10) (2020-05-21)

**Note:** Version bump only for package test-app





## [1.1.9](https://github.com/blockstack/ux/compare/test-app@1.1.7...test-app@1.1.9) (2020-05-15)

**Note:** Version bump only for package test-app





## [1.1.7](https://github.com/blockstack/ux/compare/test-app@1.1.6...test-app@1.1.7) (2020-05-06)

**Note:** Version bump only for package test-app





## [1.1.6](https://github.com/blockstack/ux/compare/test-app@1.1.5...test-app@1.1.6) (2020-04-30)

**Note:** Version bump only for package test-app





## [1.1.5](https://github.com/blockstack/ux/compare/test-app@1.1.4...test-app@1.1.5) (2020-04-17)

**Note:** Version bump only for package test-app





## [1.1.4](https://github.com/blockstack/ux/compare/test-app@1.1.3...test-app@1.1.4) (2020-03-12)

**Note:** Version bump only for package test-app





## [1.1.3](https://github.com/blockstack/ux/compare/test-app@1.1.2...test-app@1.1.3) (2020-03-12)

**Note:** Version bump only for package test-app





## [1.1.2](https://github.com/blockstack/ux/compare/test-app@1.1.1...test-app@1.1.2) (2020-03-11)


### Bug Fixes

* prod test-app not linking to prod authenticator ([d778c0f](https://github.com/blockstack/ux/commit/d778c0fcf2fffb781d4ea9b684660c8b362df31b))





## [1.1.1](https://github.com/blockstack/ux/compare/test-app@1.1.0...test-app@1.1.1) (2020-03-10)

**Note:** Version bump only for package test-app





# [1.1.0](https://github.com/blockstack/ux/compare/test-app@1.0.3...test-app@1.1.0) (2020-03-10)


### Features

* implementation of router ([bd03411](https://github.com/blockstack/ux/commit/bd034112a098868d07e04dc6aba97d15145707d1))





## [1.0.3](https://github.com/blockstack/ux/compare/test-app@1.0.2...test-app@1.0.3) (2020-03-10)

**Note:** Version bump only for package test-app





## [1.0.2](https://github.com/blockstack/ux/compare/test-app@1.0.1...test-app@1.0.2) (2020-03-10)

**Note:** Version bump only for package test-app





## 1.0.1 (2020-03-10)

**Note:** Version bump only for package test-app
