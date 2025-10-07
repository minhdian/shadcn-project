import { createFileRoute } from '@tanstack/react-router'
import { Study } from './-page'
import { CourseProvider } from '../../../contexts/CourseContext'

export const Route = createFileRoute('/_authenticated/study/')({
  component: () => (
    <CourseProvider>
      <Study />
    </CourseProvider>
  ),
})

