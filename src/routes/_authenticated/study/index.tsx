import { createFileRoute } from '@tanstack/react-router'
import {Study} from './-page'


export const Route = createFileRoute('/_authenticated/study/')({
  component: Study,
})

