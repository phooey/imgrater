import { defineParameterType } from '@cucumber/cucumber'

defineParameterType({
  name: 'direction',
  regexp: /up|down/,
  transformer: direction => { return direction },
})
