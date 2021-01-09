# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 2.17.15 (2021-01-09)

**Note:** Version bump only for package @stacks/connect-react





## 2.17.14 (2021-01-08)


### Bug Fixes

* broken tx signing with extension ([0235140](https://github.com/blockstack/ux/commit/023514021c64e06a80bc31125831d5c35ece3118))





## 2.17.13 (2021-01-06)


### Bug Fixes

* ignore exit code from FF addon publish ([ae05d36](https://github.com/blockstack/ux/commit/ae05d3608ac48cf3944d6d62ead2be65bc11bfde))





## 2.17.12 (2021-01-06)


### Bug Fixes

* use job conditionals instead of workflow conditional ([772b374](https://github.com/blockstack/ux/commit/772b3740def1b31fccf004630ef2d29d167210a4))





## 2.17.11 (2021-01-06)


### Bug Fixes

* ignore tags refs for version workflow ([d2a18fc](https://github.com/blockstack/ux/commit/d2a18fc45a4198a112e881552fbb6c502e557d90))





## 2.17.10 (2021-01-06)


### Bug Fixes

* better syntax for excluding tagged commits' ([4729d01](https://github.com/blockstack/ux/commit/4729d01a5afea316c55dade9143f83748b25071b))





## 2.17.9 (2021-01-06)


### Bug Fixes

* dont run publish on master commits without tag ([0b7cb3a](https://github.com/blockstack/ux/commit/0b7cb3ac50af92bd9ad993b70d48cd930fd31c29))





## 2.17.8 (2021-01-06)

**Note:** Version bump only for package @stacks/connect-react





## 2.17.7 (2020-12-29)


### Bug Fixes

* build rpc pkg before deploying contracts ([c56d3f7](https://github.com/blockstack/ux/commit/c56d3f776494cd471aba77d35b7c5eba20ec245f))





## 2.17.6 (2020-12-29)


### Bug Fixes

* support ts paths in deploy-contracts script ([4bc3ce3](https://github.com/blockstack/ux/commit/4bc3ce3030e392f850cdeaea0e55c6bbaba7c15e))





## 2.17.5 (2020-12-29)


### Bug Fixes

* build packages before deploy-contracts script ([66f0857](https://github.com/blockstack/ux/commit/66f0857cde41d197c29682eedefd46bc16910096))





## 2.17.4 (2020-12-29)


### Bug Fixes

* auto-deploy testnet contracts with github actions ([b1b5c97](https://github.com/blockstack/ux/commit/b1b5c977bc90a9c47e08264d7e0aef665099696e))





## 2.17.3 (2020-12-14)


### Bug Fixes

* prod deploy apps job action ([b8ccc59](https://github.com/blockstack/ux/commit/b8ccc59d1c024705b80991ecb604030f8590e89d))





## 2.17.2 (2020-12-14)


### Bug Fixes

* change lerna publish to skip existing versions ([ac16572](https://github.com/blockstack/ux/commit/ac16572dba7e8d3e770bb4ba61d77094bcad02f9))





## 2.17.1 (2020-12-04)


### Bug Fixes

* export auth from connect ([d201aab](https://github.com/blockstack/ux/commit/d201aab14f2ced0b5f666be571035b7cbf76c602))





# 2.17.0 (2020-11-25)


### Features

* update extension build instructions ([4d55afa](https://github.com/blockstack/ux/commit/4d55afa51dbc3b4cedb81de679b16b91b2df007c))





## 2.16.4 (2020-11-18)


### Bug Fixes

* duplicate 'powered by' on sign in, fixes [#629](https://github.com/blockstack/ux/issues/629) ([6648517](https://github.com/blockstack/ux/commit/6648517e01cdd34a91225dfe08483055b418439c))





## 2.16.3 (2020-11-17)


### Bug Fixes

* update actions to fix set-path err ([0b4fd95](https://github.com/blockstack/ux/commit/0b4fd955f920d5c549690945a18673ea5f0462ae))





## 2.16.2 (2020-11-13)

**Note:** Version bump only for package @stacks/connect-react





## 2.16.1 (2020-11-09)


### Bug Fixes

* build connect ui in build-ext.sh ([c0bd586](https://github.com/blockstack/ux/commit/c0bd586da2baace269144d8797555177882de76a))





# 2.16.0 (2020-11-07)


### Features

* more tests for url validation ([cad6e6a](https://github.com/blockstack/ux/commit/cad6e6a489bfd4de67ff8c20e480b3db99e97e4e))





## 2.15.4 (2020-11-06)


### Bug Fixes

* blockstack, react dep versions ([7f23d36](https://github.com/blockstack/ux/commit/7f23d36b0b6e4531027cd4b2c3cf5d76c7a274d2))





## 2.15.3 (2020-11-05)


### Bug Fixes

* valid-url package for url validation ([2d0664b](https://github.com/blockstack/ux/commit/2d0664b302dbf7464a9c9c5730e85675375b5a0e))





## 2.15.2 (2020-11-05)


### Bug Fixes

* add dep to app ([eade246](https://github.com/blockstack/ux/commit/eade246edadfb2963c543f3647ba348f77c170ec))





## 2.15.1 (2020-11-05)


### Bug Fixes

* add additional url validation ([1b67fbd](https://github.com/blockstack/ux/commit/1b67fbd91d0eb3cbfabfed297b9e18dfd7ab497b))





# 2.15.0 (2020-11-04)


### Features

* further simplify app instructions ([598827d](https://github.com/blockstack/ux/commit/598827d919fb62f9cc5308ebee5eac6acec4e982))





## 2.14.1 (2020-11-03)


### Bug Fixes

* proper glob for lerna packages ([5367055](https://github.com/blockstack/ux/commit/5367055e9c6622dd0a93f97275ab652a9af56bf9))





# 2.14.0 (2020-11-02)


### Bug Fixes

* only build modules for connect-react, not standalone ([a6174a2](https://github.com/blockstack/ux/commit/a6174a2e2a809776bbb1bac3629afa0078692be6))
* stencil publishing tweaks ([db45290](https://github.com/blockstack/ux/commit/db45290e6effbae8e91c9f0d2ab3c9d205cca0f0))


### Features

* refactor connect ui into web components with stencil ([7f65900](https://github.com/blockstack/ux/commit/7f65900fd6f648dcad57502d985b8dc862e7b72f)), closes [#581](https://github.com/blockstack/ux/issues/581) [#604](https://github.com/blockstack/ux/issues/604) [#612](https://github.com/blockstack/ux/issues/612) [#606](https://github.com/blockstack/ux/issues/606) [#613](https://github.com/blockstack/ux/issues/613)
* rename all packages to [@stacks](https://github.com/stacks) ([b56e750](https://github.com/blockstack/ux/commit/b56e750db5b30d4c56e9669285a11db565e8a675))





## [2.13.1](https://github.com/blockstack/ux/compare/@stacks/connect-react@2.13.0...@stacks/connect-react@2.13.1) (2020-11-02)

**Note:** Version bump only for package @stacks/connect-react





# 2.13.0 (2020-11-02)


### Bug Fixes

* only build modules for connect-react, not standalone ([a6174a2](https://github.com/blockstack/ux/commit/a6174a2e2a809776bbb1bac3629afa0078692be6))


### Features

* refactor connect ui into web components with stencil ([7f65900](https://github.com/blockstack/ux/commit/7f65900fd6f648dcad57502d985b8dc862e7b72f)), closes [#581](https://github.com/blockstack/ux/issues/581) [#604](https://github.com/blockstack/ux/issues/604) [#612](https://github.com/blockstack/ux/issues/612) [#606](https://github.com/blockstack/ux/issues/606) [#613](https://github.com/blockstack/ux/issues/613)
* rename all packages to [@stacks](https://github.com/stacks) ([b56e750](https://github.com/blockstack/ux/commit/b56e750db5b30d4c56e9669285a11db565e8a675))





## 2.12.7 (2020-10-05)


### Bug Fixes

* **connect:** use authOrigin from authOptions ([e6602a8](https://github.com/blockstack/ux/commit/e6602a8a559158d3ecf92268495176619d1f340e))





## 2.12.6 (2020-10-05)


### Bug Fixes

* remaining broken sidecar urls, fixes [#615](https://github.com/blockstack/ux/issues/615) ([4c26fce](https://github.com/blockstack/ux/commit/4c26fcea34c1603e4ea63d1be7b576b9ccb45a42))





## 2.12.5 (2020-09-29)


### Bug Fixes

* update node api url ([7c71cc7](https://github.com/blockstack/ux/commit/7c71cc7fd47cdb5626d618be70c953f3bfb9d7f7))





## 2.12.4 (2020-09-25)


### Bug Fixes

* add yarn.lock ([24d88d5](https://github.com/blockstack/ux/commit/24d88d5a29d2a4d3d8acee5ce70cd5ecb3c997c4))





## 2.12.3 (2020-09-16)


### Bug Fixes

* keychain lib still broken ([1a7fd0c](https://github.com/blockstack/ux/commit/1a7fd0ced01a6ec8bdd31bf84140728e4b1d7e30))





## 2.12.2 (2020-09-10)


### Bug Fixes

* **keychain:** use correct filepath when writing profiles ([fa8098a](https://github.com/blockstack/ux/commit/fa8098ae13973dd5e53303a4b04967a956d8842b))





## 2.12.1 (2020-08-21)

**Note:** Version bump only for package @blockstack/connect





# [2.12.0](https://github.com/blockstack/ux/compare/@blockstack/connect@2.11.0...@blockstack/connect@2.12.0) (2020-08-21)


### Features

* change copy of intro modal CTA, fixes [#466](https://github.com/blockstack/ux/issues/466) ([6b64222](https://github.com/blockstack/ux/commit/6b64222fc31ab5af4b9807ae280101039388b223))
* dont use popups in mobile, adds method to handle redirect auth ([450f58b](https://github.com/blockstack/ux/commit/450f58bcb5c3431d6b1ac649d19f319da34d9f7f))
* show 'install extension' on intro, fixes [#469](https://github.com/blockstack/ux/issues/469) ([faa8071](https://github.com/blockstack/ux/commit/faa80714ab7269904ed3388d000eb96b8aab1676))





# [2.11.0](https://github.com/blockstack/ux/compare/@blockstack/connect@2.10.5...@blockstack/connect@2.11.0) (2020-08-11)


### Features

* add button to get extension ([f0ba354](https://github.com/blockstack/ux/commit/f0ba3545226886f928b01dbf2fb2e3e620ac5bf3))





## 2.10.5 (2020-07-30)


### Bug Fixes

* reset text-align within connect modal, fixes [#458](https://github.com/blockstack/ux/issues/458) ([aecc700](https://github.com/blockstack/ux/commit/aecc70016809c3750d5cde730db4aeaffd52bb98))





## 2.10.4 (2020-07-28)

**Note:** Version bump only for package @blockstack/connect





## 2.10.3 (2020-07-28)


### Bug Fixes

* cursor pointer on dont show this again, fixes [#508](https://github.com/blockstack/ux/issues/508) ([fe4dcf4](https://github.com/blockstack/ux/commit/fe4dcf418526289685687ad9f4526cd45db85410))





## 2.10.2 (2020-07-27)


### Bug Fixes

* **connect:** pass all data to token ([3f46f60](https://github.com/blockstack/ux/commit/3f46f600cccfeadca381574b2b493709b4bba590))





## 2.10.1 (2020-07-24)


### Bug Fixes

* send to sign in when using showBlockstackConnect, fixes [#507](https://github.com/blockstack/ux/issues/507) ([d7698e8](https://github.com/blockstack/ux/commit/d7698e839e44177e56617701d9df0bca5a60924a))





# 2.10.0 (2020-07-24)


### Features

* better bundle size with esmodules ([2c7046f](https://github.com/blockstack/ux/commit/2c7046f70d2ea10ffd973a4ea816a760ffc26952))





## 2.9.1 (2020-07-24)


### Bug Fixes

* force app icon 100% size in connect modal, fixes [#455](https://github.com/blockstack/ux/issues/455) ([4f69f75](https://github.com/blockstack/ux/commit/4f69f75cf7a153c6511cd200e3d1604e5a049226))





# 2.9.0 (2020-07-23)


### Features

* expose connect, app version ([b90a618](https://github.com/blockstack/ux/commit/b90a618fbeaac0ed998ec5ecd10eda8facdc6e10))





## 2.8.6 (2020-07-22)


### Bug Fixes

* docs not building ([d6acb21](https://github.com/blockstack/ux/commit/d6acb21d6e9d6ca171dbbac13a2cc38e7f68b4b9))





## 2.8.5 (2020-07-22)


### Bug Fixes

* workflow syntax for test-app deployment ([976fe54](https://github.com/blockstack/ux/commit/976fe54ee4e0e28833bad515ceccc5fd7f98df3a))





## 2.8.4 (2020-07-22)

**Note:** Version bump only for package @blockstack/connect





## 2.8.3 (2020-07-14)


### Bug Fixes

* textStyles not being typed ([2428f69](https://github.com/blockstack/ux/commit/2428f69ddc39f20c566f2686a65959b59f52e9aa))





## 2.8.2 (2020-07-09)

**Note:** Version bump only for package @blockstack/connect





## 2.8.1 (2020-07-09)

**Note:** Version bump only for package @blockstack/connect





# 2.8.0 (2020-07-07)


### Features

* add codesandbox ci ([9e903d7](https://github.com/blockstack/ux/commit/9e903d7141c21503339159255cd06fb6701b1e3b))





## 2.7.10 (2020-06-30)

**Note:** Version bump only for package @blockstack/connect





## [2.7.9](https://github.com/blockstack/ux/compare/@blockstack/connect@2.7.8...@blockstack/connect@2.7.9) (2020-06-30)

**Note:** Version bump only for package @blockstack/connect





## [2.7.8](https://github.com/blockstack/ux/compare/@blockstack/connect@2.7.7...@blockstack/connect@2.7.8) (2020-06-30)


### Bug Fixes

* replace Connect README with link to documentation; resolve [#423](https://github.com/blockstack/ux/issues/423) ([ac0d2e9](https://github.com/blockstack/ux/commit/ac0d2e9afc1c9853948a04f6504b80d64f75ddbe))





## [2.7.7](https://github.com/blockstack/ux/compare/@blockstack/connect@2.7.6...@blockstack/connect@2.7.7) (2020-06-24)


### Bug Fixes

* ui version behind published ([8198ca0](https://github.com/blockstack/ux/commit/8198ca050baa5e7294f99f4521aba78cab7635d8))





## [2.7.6](https://github.com/blockstack/ux/compare/@blockstack/connect@2.7.4...@blockstack/connect@2.7.6) (2020-06-24)


### Bug Fixes

* better readme for firefox install ([cbecc86](https://github.com/blockstack/ux/commit/cbecc86e975a9b758260dbb16e3c29a938717d60))
* connect version was behind published ([2d7633e](https://github.com/blockstack/ux/commit/2d7633e8b842cf231f10c2ea032de3bcd67258ff))
* tweaks to get extension working ([e068dce](https://github.com/blockstack/ux/commit/e068dcec1eca8c30375564a748ff3df4f0e8c715))





## [2.7.4](https://github.com/blockstack/ux/compare/@blockstack/connect@2.7.3...@blockstack/connect@2.7.4) (2020-06-10)

**Note:** Version bump only for package @blockstack/connect





## [2.7.3](https://github.com/blockstack/ux/compare/@blockstack/connect@2.7.2...@blockstack/connect@2.7.3) (2020-06-07)


### Bug Fixes

* better handling for mobile and blocked popups ([3151863](https://github.com/blockstack/ux/commit/31518632bf91c6217734c21c1163ae076f22368a))





## [2.7.2](https://github.com/blockstack/ux/compare/@blockstack/connect@2.7.1...@blockstack/connect@2.7.2) (2020-05-21)

**Note:** Version bump only for package @blockstack/connect





## [2.7.1](https://github.com/blockstack/ux/compare/@blockstack/connect@2.6.0...@blockstack/connect@2.7.1) (2020-05-15)

**Note:** Version bump only for package @blockstack/connect





# [2.6.0](https://github.com/blockstack/ux/compare/@blockstack/connect@2.4.0...@blockstack/connect@2.6.0) (2020-05-06)


### Bug Fixes

* **connect:** dep adjustments ([28cf998](https://github.com/blockstack/ux/commit/28cf998777e66a36e9d9568c05c5f235f7fcb721))
* shouldForwardProp updates ([a2d3964](https://github.com/blockstack/ux/commit/a2d396459b62a1d11dd816b618e7f7e2edc3fe66))


### Features

* codebox and highlighter ([b9056f8](https://github.com/blockstack/ux/commit/b9056f8102eff8d32898201717a3cd3699234561))





# [2.4.0](https://github.com/blockstack/ux/compare/@blockstack/connect@2.3.1...@blockstack/connect@2.4.0) (2020-04-30)


### Features

* remove secret key branding, [#334](https://github.com/blockstack/ux/issues/334) ([e57c8bc](https://github.com/blockstack/ux/commit/e57c8bc84540b352078e56f19cada41ba0ef6904))





## [2.3.1](https://github.com/blockstack/ux/compare/@blockstack/connect@2.3.0...@blockstack/connect@2.3.1) (2020-03-12)

**Note:** Version bump only for package @blockstack/connect





# [2.3.0](https://github.com/blockstack/ux/compare/@blockstack/connect@2.2.0...@blockstack/connect@2.3.0) (2020-03-12)


### Features

* improve accessibility of connect modal, links ([74352c7](https://github.com/blockstack/ux/commit/74352c74b5894fa2a612a20f00c02d9f8791a5c2))





# [2.2.0](https://github.com/blockstack/ux/compare/@blockstack/connect@2.1.0...@blockstack/connect@2.2.0) (2020-03-10)


### Features

* add ability to view secret key ([440c3e5](https://github.com/blockstack/ux/commit/440c3e5420321e1a3bcfe409cf65b44fe45e1330))





# [2.1.0](https://github.com/blockstack/ux/compare/@blockstack/connect@2.0.2...@blockstack/connect@2.1.0) (2020-03-10)


### Bug Fixes

* dont require built ui to build connect ([c354be7](https://github.com/blockstack/ux/commit/c354be7bae0937dbcfdbfbb971f1f85a0a6057a9))


### Features

* implementation of router ([bd03411](https://github.com/blockstack/ux/commit/bd034112a098868d07e04dc6aba97d15145707d1))





## [2.0.2](https://github.com/blockstack/ux/compare/@blockstack/connect@2.0.1...@blockstack/connect@2.0.2) (2020-03-10)

**Note:** Version bump only for package @blockstack/connect





## [2.0.1](https://github.com/blockstack/ux/compare/@blockstack/connect@2.0.0...@blockstack/connect@2.0.1) (2020-03-10)

**Note:** Version bump only for package @blockstack/connect





# 2.0.0 (2020-03-10)


### Bug Fixes

* 32px horizontal padding ([c0391c3](https://github.com/blockstack/ux/commit/c0391c30953743c9218b44a65d91a5cfb32ab3b9))
* add 40px padding to intro title component ([adb3fd8](https://github.com/blockstack/ux/commit/adb3fd8df4faed8c85968617b8efbf2f1153ce8f))
* add ability for screen to be form, and use onSubmit. Additionally added --mode to webpack command ([3c4b961](https://github.com/blockstack/ux/commit/3c4b9614daf171fa953828f6d8eccff1723ab9cd))
* adjust case on button ([50d4bd4](https://github.com/blockstack/ux/commit/50d4bd41137212c8330405748bc7e6e350a334a8))
* adjust horizontal spacing on screen components ([21b481f](https://github.com/blockstack/ux/commit/21b481f58e843006aad717df4588260cb4c99ea0))
* adjust root dir so packages can build correctly ([f99c210](https://github.com/blockstack/ux/commit/f99c2109a0068250e0983c65a4c5a4e713ddc0e7))
* adjust size of buttons ([611c13d](https://github.com/blockstack/ux/commit/611c13d9d8b61aa50a3ff3b283db025b4c2e370e))
* adjust task names, add bootstrap task ([099038f](https://github.com/blockstack/ux/commit/099038f26e6664a6de9a64c86dfb24eb03d94a31))
* Allow optional title ([#21](https://github.com/blockstack/ux/issues/21)) ([68d44cd](https://github.com/blockstack/ux/commit/68d44cdeaa812085a4018ded47f6dd4310b56e57))
* allow type component to take BoxProps ([3831b40](https://github.com/blockstack/ux/commit/3831b4072a219e7203c56be6e594fb99c0697a50))
* Button size ([#31](https://github.com/blockstack/ux/issues/31)) ([218eb22](https://github.com/blockstack/ux/commit/218eb2273acdbf39e66722f2e32fcba8339669e2))
* footer link size ([285d4e9](https://github.com/blockstack/ux/commit/285d4e94db37e57b8fcea8a4d228d26af3996caa))
* header margins, change visual content flow, closes [#261](https://github.com/blockstack/ux/issues/261) ([21abfe6](https://github.com/blockstack/ux/commit/21abfe695a6b5a00c4a4f0bd2fe0dd9fec4a8397))
* hide close icon on how it works, [#84](https://github.com/blockstack/ux/issues/84) ([f1c0120](https://github.com/blockstack/ux/commit/f1c01209f17f7c977ac02f5510e8017e4c9c3ced))
* Incorrect intro page footer text ([3736b44](https://github.com/blockstack/ux/commit/3736b44c63d5024ed726b09de176c68174fac7b3))
* link size on how it works, [#83](https://github.com/blockstack/ux/issues/83) ([97935f7](https://github.com/blockstack/ux/commit/97935f7324e908201031590652c454017e585ead))
* no need for -57px ([d1fde14](https://github.com/blockstack/ux/commit/d1fde1415b28ac7dc2562f3ad4a4873065d8d892))
* only use window for scroll lock if available ([6f30a3c](https://github.com/blockstack/ux/commit/6f30a3ce7ae4afac22a68192600d1a767b120394))
* pass close fn to modal for onclickoutside ([9b2c2d0](https://github.com/blockstack/ux/commit/9b2c2d0440e28c44a18a5ff944b69948beed3c24))
* remove background on button style ([9742771](https://github.com/blockstack/ux/commit/974277168b33ec0cf0aea8c541e8f607ab689b77))
* remove button border ([0d7a2c7](https://github.com/blockstack/ux/commit/0d7a2c7acd57e38f6d829bec57ddd65d80f8c466))
* Remove demo wording, Closes blockstack/app[#208](https://github.com/blockstack/ux/issues/208) ([21acc09](https://github.com/blockstack/ux/commit/21acc09b8cfa3b527244226efc0122b5e424d275))
* Remove hard coded app name, Closes blockstack/app[#134](https://github.com/blockstack/ux/issues/134) ([db460ad](https://github.com/blockstack/ux/commit/db460ad5ec4ff83e3ac3145b6813ee1154aa718a))
* remove hover from powered by, fixes blockstack/app[#123](https://github.com/blockstack/ux/issues/123) ([31cbd0d](https://github.com/blockstack/ux/commit/31cbd0d8467bf915588f1182acfcf9de15f0d048))
* remove returns ([6ac8d61](https://github.com/blockstack/ux/commit/6ac8d617e536b0167b233a6f9ce11639146fa471))
* removes title elements from modal header conditionally, adjust spacing of appElement component ([f713136](https://github.com/blockstack/ux/commit/f713136cd367d0a1a4d75dbca5b5d4ca6ca8ab41))
* replace css-reset with scoped version ([e5488c4](https://github.com/blockstack/ux/commit/e5488c441f19b44984892059ace86883f341198b))
* screen components horizontal padding ([81c7c1b](https://github.com/blockstack/ux/commit/81c7c1b475914523486d2bf34ee149a116636a1f))
* title styles on intro, size and line-height ([8dfdbd0](https://github.com/blockstack/ux/commit/8dfdbd0d024e01857ee26440bd2520f3e771e28b))
* update units ([d3320bd](https://github.com/blockstack/ux/commit/d3320bddba5918f16faf879cf5bfd0528ed6debf))


### Code Refactoring

* rename all instances with "data vault" ([182849e](https://github.com/blockstack/ux/commit/182849ebcfcbae56cde06dea9d018e156e5b65ec))


### Features

* add CI, proper connections between packages ([5934829](https://github.com/blockstack/ux/commit/5934829a40338ac269b80783912c8dad17af1962))
* Add utm codes to app URL ([9b00a58](https://github.com/blockstack/ux/commit/9b00a58c42121bdc23d44a7c2c943a57e4593f8d))
* make `manifestPath` optional ([bb1e287](https://github.com/blockstack/ux/commit/bb1e287d797545d5aa5f5e4fd682a1b8478d8f01))
* make redirectTo optional, default to '/' ([392c871](https://github.com/blockstack/ux/commit/392c8715b7d4c07009a8f3695ece914249eb2bfc))
* new hook -- useScrollLock -- lock body scroll when modal is open ([e058848](https://github.com/blockstack/ux/commit/e0588488745a4a7b9b59a5f28e10e1fa6dc92d25))
* prompt password managers earlier in flow, closes [#224](https://github.com/blockstack/ux/issues/224) ([12a6772](https://github.com/blockstack/ux/commit/12a6772fa86096687bcdc5801ea46f7ab42985ee))
* remove finished screen, closes [#32](https://github.com/blockstack/ux/issues/32) ([8d85e74](https://github.com/blockstack/ux/commit/8d85e74b0e43c7a8f39ddc3ba272736dbf00f8ef))
* update copy and branding ([7720d10](https://github.com/blockstack/ux/commit/7720d1065acb8cdea94dcd71f90cb58abceeb113))
* update default auth URL ([bd86c90](https://github.com/blockstack/ux/commit/bd86c90a6b9f14ab75d2a7531d83d8aaef7b78cf))
* updated README ([a61c4a4](https://github.com/blockstack/ux/commit/a61c4a403128ca4a2d01dea116b97465f661d30b)), closes [#22](https://github.com/blockstack/ux/issues/22)
* updates default domain to app.blockstack.org ([1b39068](https://github.com/blockstack/ux/commit/1b39068a6d5120d0ba885890519c3c14baef8d42))
* window.focus() after auth finished ([f3003f6](https://github.com/blockstack/ux/commit/f3003f699012c4f21489b0b41274cc171253b72f))


### BREAKING CHANGES

* some API methods have been renamed
