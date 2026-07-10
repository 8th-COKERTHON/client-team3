import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CTAButton from '../../components/CTAButton'
import AuthInput from '../../components/AuthInput'
import Header from '../../components/Header'
import { signUp } from '../../api/auth'
import { ApiError } from '../../types/api'

type SignUpField = 'name' | 'loginId' | 'password' | 'confirmPassword'

function isValidPassword(password: string) {
  return password.length >= 8 && /\d/.test(password)
}

function SignUpPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    loginId: '',
    password: '',
    confirmPassword: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    loginId: '',
    password: '',
    confirmPassword: '',
  })
  const [touched, setTouched] = useState<Record<SignUpField, boolean>>({
    name: false,
    loginId: false,
    password: false,
    confirmPassword: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = (field: SignUpField, nextForm = form) => {
    if (field === 'name') {
      if (!nextForm.name.trim()) {
        return '이름을 입력해주세요.'
      }
      return ''
    }

    if (field === 'loginId') {
      if (!nextForm.loginId.trim()) {
        return '아이디를 입력해주세요.'
      }
      return ''
    }

    if (field === 'password') {
      if (!nextForm.password.trim()) {
        return '비밀번호를 입력해주세요.'
      }
      if (!isValidPassword(nextForm.password)) {
        return '비밀번호는 8자 이상이며 숫자를 포함해야 합니다.'
      }
      return ''
    }

    if (field === 'confirmPassword') {
      if (!nextForm.confirmPassword.trim()) {
        return '비밀번호를 확인해주세요.'
      }
      if (nextForm.password !== nextForm.confirmPassword) {
        return '비밀번호가 일치하지 않습니다.'
      }
      return ''
    }

    return ''
  }

  const handleChange =
    (field: SignUpField) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      const nextForm = { ...form, [field]: value }

      setForm(nextForm)
      setErrorMessage('')

      if (touched[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: validateField(field, nextForm) }))
      } else {
        setFieldErrors((prev) => ({ ...prev, [field]: '' }))
      }

      if (field === 'password' && touched.confirmPassword) {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: validateField('confirmPassword', nextForm),
        }))
      }
    }

  const handleBlur = (field: SignUpField) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setFieldErrors((prev) => ({ ...prev, [field]: validateField(field) }))

    if (field === 'password' && touched.confirmPassword) {
      setFieldErrors((prev) => ({
        ...prev,
        password: validateField('password'),
        confirmPassword: validateField('confirmPassword'),
      }))
    }
    if (field === 'confirmPassword') {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: validateField('confirmPassword') }))
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextFieldErrors = {
      name: validateField('name'),
      loginId: validateField('loginId'),
      password: validateField('password'),
      confirmPassword: validateField('confirmPassword'),
    }

    setTouched({
      name: true,
      loginId: true,
      password: true,
      confirmPassword: true,
    })

    setFieldErrors(nextFieldErrors)

    if (Object.values(nextFieldErrors).some(Boolean)) {
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      await signUp({
        name: form.name.trim(),
        loginId: form.loginId.trim(),
        password: form.password,
        passwordCheck: form.confirmPassword,
      })

      navigate('/login')
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.message.includes('아이디')) {
          setFieldErrors((prev) => ({ ...prev, loginId: error.message }))
        } else {
          setErrorMessage(error.message)
        }
      } else {
        setErrorMessage('회원가입 중 오류가 발생했습니다.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="w-full h-dvh bg-white pt-[20px] pb-[24px]">
      <Header title="회원가입" onBack={() => navigate(-1)} />

      <form
        onSubmit={handleSubmit}
        className="flex min-h-[calc(100dvh-84px)] flex-col p-5"
      >
        <div className="flex flex-col gap-[20px]">
          <AuthInput
            label="이름"
            value={form.name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
            placeholder="이름을 입력해주세요."
            errorMessage={touched.name ? fieldErrors.name : ''}
          />

          <AuthInput
            label="아이디"
            value={form.loginId}
            onChange={handleChange('loginId')}
            onBlur={handleBlur('loginId')}
            placeholder="아이디를 입력해주세요."
            errorMessage={touched.loginId ? fieldErrors.loginId : ''}
          />

          <AuthInput
            label="비밀번호"
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            onBlur={handleBlur('password')}
            placeholder="비밀번호를 입력해주세요."
            errorMessage={touched.password ? fieldErrors.password : ''}
          />

          <AuthInput
            label="비밀번호 확인"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            placeholder="비밀번호를 확인해주세요."
            errorMessage={touched.confirmPassword ? fieldErrors.confirmPassword : ''}
          />
        </div>

        <div className="mt-auto flex flex-col items-center gap-[8px] pt-[24px]">
          {errorMessage && (
            <p className="w-full text-center text-body-02 font-medium leading-[1.5] text-brand">
              {errorMessage}
            </p>
          )}
          <CTAButton type="submit" disabled={isSubmitting}>
            저장하기
          </CTAButton>
        </div>
      </form>
    </main>
  )
}

export default SignUpPage
