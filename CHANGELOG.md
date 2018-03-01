# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).

## Unreleased
### Added
- Pecorino口座関連のエンドポイントを追加。
- 注文返品取引サービスを追加。

### Changed
- イベント検索条件から非推奨属性(day,theater)を削除。

### Deprecated

### Removed

### Fixed

### Security


## v2.1.2 - 2018-02-15
### Fixed
- クライアントサイドではUser-Agentを手動でセットできないので、パッケージ情報をUser-Agentに付加する処理を、DefaultTransporterから取り除く対応。

## v2.1.1 - 2017-12-06
### Fixed
- 注文取引サービスのレスポンス型を修正。

## v2.1.0 - 2017-11-28
### Changed
- イベント検索の検索条件にプロパティ追加。
- 注文取引開始のパラメーターに許可証トークンを追加。

### Fixed
- 認証エラーでリトライした際にアクセストークンが再セットされないバグを修正。

### Security
- テスト網羅率100%化。

## v2.0.0 - 2017-10-21
### Changed
- 座席予約の供給情報インターフェースを変更。

## v1.2.0 - 2017-10-19
### Added
- 座席予約承認アクションに対して供給情報を更新するサービスを追加。

## v1.1.1 - 2017-09-28
### Changed
- exampleを調整。

### Security
- update dependencies.

## v1.1.0 - 2017-09-25
### Changed
- 取引承認アクションのエンドポイントを変更。

## v1.0.0 - 2017-09-25
### Added
- v1.0.0をリリース。
