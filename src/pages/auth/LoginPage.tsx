import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CTAButton from '../../components/CTAButton'
import AuthInput from '../../components/AuthInput'
import Header from '../../components/Header'
import { login } from '../../api/auth'
import { clearSavedGroupId, saveGroupId } from '../../api/group'
import { ApiError } from '../../types/api'

type LoginField = 'loginId' | 'password'

function isValidPassword(password: string) {
  return password.length >= 8 && /\d/.test(password)
}

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    loginId: '',
    password: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({
    loginId: '',
    password: '',
  })
  const [touched, setTouched] = useState<Record<LoginField, boolean>>({
    loginId: false,
    password: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = (field: LoginField, nextForm = form) => {
    if (field === 'password' && nextForm.password.length > 0 && !isValidPassword(nextForm.password)) {
      return '비밀번호는 8자 이상이며 숫자를 포함해야 합니다.'
    }
    return ''
  }

  const handleChange =
    (field: LoginField) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      const nextForm = { ...form, [field]: value }

      setForm(nextForm)
      setErrorMessage('')

      if (touched[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: validateField(field, nextForm) }))
      } else {
        setFieldErrors((prev) => ({ ...prev, [field]: '' }))
      }
    }

  const handleBlur = (field: LoginField) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setFieldErrors((prev) => ({ ...prev, [field]: validateField(field) }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setTouched({
      loginId: true,
      password: true,
    })

    setFieldErrors({
      loginId: validateField('loginId'),
      password: validateField('password'),
    })

    if (validateField('password')) {
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      const response = await login(form)
      const [groupId] = response.data.groupIds

      if (groupId) {
        saveGroupId(groupId)
        navigate('/')
      } else {
        clearSavedGroupId()
        navigate('/room-entry')
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.message.includes('아이디')) {
          setFieldErrors((prev) => ({ ...prev, loginId: error.message }))
        } else if (error.message.includes('비밀번호')) {
          setFieldErrors((prev) => ({ ...prev, password: error.message }))
        } else {
          setErrorMessage(error.message)
        }
      } else {
        setErrorMessage('로그인 중 오류가 발생했습니다.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="w-full h-dvh bg-white pt-[20px] pb-[24px]">
      <Header title="로그인" onBack={() => navigate(-1)} />

      <form
        onSubmit={handleSubmit}
        className="flex min-h-[calc(100dvh-84px)] flex-col p-5"
      >
        <div className="flex flex-col gap-[20px]">
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
        </div>

        <div className="mt-auto flex flex-col items-center gap-[8px] pt-[24px]">
          {errorMessage && (
            <p className="w-full text-center text-body-02 font-medium leading-[1.5] text-brand">
              {errorMessage}
            </p>
          )}
          <CTAButton type="submit" disabled={isSubmitting}>
            로그인
          </CTAButton>
          <Link to="/signup" className="text-body-02 font-medium leading-[1.5] text-[#969696]">
            회원가입하러 가기
          </Link>
        </div>
      </form>
    </main>
  )
}

export default LoginPage
