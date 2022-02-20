# API
## Development
### Run
```shell
npm run dev
```
### Database migrations
Generate migrations
```shell
typeorm migration:generate -p -n <migration name>
```
Run migrations
```shell
typeorm migration:run
```

### Version update
```shell
npm version <patch, minor, major>
```