# Browser release checklist

- [ ] `git flow release start 0.14.0` where 0.14.0 is the version of the release
- [ ] `git flow release publish` (optional, shares release branch)
- [ ] update version in `/package.json`
- [ ] update version and build number in xcode
- [ ] commit version changes
- [ ] make sure `native/macos/build_blockstack_virtualenv.sh` is using desired version of core
- [ ] Exit locally running Blockstack & stop any regtest instances
- [ ] `rm -Rvf /tmp/blockstack-venv/`
- [ ] `npm run mac-release`
- [ ] Rename .dmg file to `Blockstack-v0.14.0.dmg`
- [ ] `git flow release finish 0.14.0`
- [ ] on `develop` branch `git push origin develop`
- [ ] `git push origin --tags`
- [ ] `git checkout master`
- [ ] Create a branch of master so that we give CircleCI a chance to run tests successfully `git checkout -b master-test` 
- [ ] `git push origin master-test`
- [ ] After CircleCI tests on `master-test` pass, `git checkout master`
- [ ] `git push origin master`
- [ ] `git branch -d master-test`
- [ ] `git push origin :master-test`
- [ ] Draft a new release on github: https://github.com/blockstack/blockstack-browser/releases/new
- [ ] Enter the tag (eg. `v0.14.0`) the tag box and as the name of the release.
- [ ] Enter release notes
- [ ] Upload the `.dmg` file generated earlier
- [ ] After verifying tests, push new version to update server.

