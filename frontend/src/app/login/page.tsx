'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { 
  UserCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  LockClosedIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface LoginForm {
  email: string
  password: string
  remember: boolean
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock authentication logic
      if (data.email === 'admin@teia-algarve.pt' && data.password === 'admin123') {
        toast.success('Login realizado com sucesso! Redirecionando...')
        // Redirect to admin panel
        window.location.href = '/admin'
      } else if (data.email.includes('@') && data.password.length >= 6) {
        toast.success('Login realizado com sucesso! Redirecionando...')
        // Redirect to user dashboard
        window.location.href = '/dashboard'
      } else {
        toast.error('Credenciais inválidas. Verifique o email e palavra-passe.')
      }
    } catch (error) {
      toast.error('Erro no servidor. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-autism-calm flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-autism-friendly rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCircleIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-accessible-2xl font-bold text-secondary-800 mb-2">
            Acesso à TEIA
          </h1>
          <p className="text-accessible-base text-secondary-600">
            Entre na sua conta para aceder às funcionalidades completas
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="label">Email</label>
              <input
                {...register('email', { 
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
                type="email"
                className="input"
                placeholder="seu.email@exemplo.com"
              />
              {errors.email && (
                <p className="text-red-500 text-accessible-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="label">Palavra-passe</label>
              <div className="relative">
                <input
                  {...register('password', { 
                    required: 'Palavra-passe é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Palavra-passe deve ter pelo menos 6 caracteres'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 hover:text-secondary-700"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-accessible-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  {...register('remember')}
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 mr-2"
                />
                <span className="text-accessible-sm text-secondary-600">Lembrar-me</span>
              </label>
              
              <Link 
                href="/recuperar-password" 
                className="text-accessible-sm text-primary-600 hover:text-primary-700 hover:underline"
              >
                Esqueceu a palavra-passe?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <LockClosedIcon className="w-5 h-5 mr-2" />
              )}
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <ShieldCheckIcon className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">Acesso Super Admin (Demo)</h3>
                <p className="text-accessible-sm text-blue-700 mb-2">
                  Para testar as funcionalidades de administração:
                </p>
                <div className="bg-blue-100 p-2 rounded text-accessible-sm font-mono">
                  <p><strong>Email:</strong> admin@teia-algarve.pt</p>
                  <p><strong>Password:</strong> admin123</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <UserGroupIcon className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800 mb-1">Acesso Usuário (Demo)</h3>
                <p className="text-accessible-sm text-green-700 mb-2">
                  Para testar as funcionalidades de usuário:
                </p>
                <div className="bg-green-100 p-2 rounded text-accessible-sm font-mono">
                  <p><strong>Email:</strong> qualquer@exemplo.com</p>
                  <p><strong>Password:</strong> 123456 (mín. 6 chars)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-1">Nota Importante</h3>
              <p className="text-accessible-sm text-amber-700">
                Apenas o Super Admin pode criar contas de usuário. Os usuários não podem se registar autonomamente, 
                conforme especificado nos requisitos da plataforma TEIA.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-accessible-sm text-secondary-500">
          <p>
            Não tem conta? Entre em contacto com o administrador através da
          </p>
          <Link 
            href="/contacto" 
            className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
          >
            página de contacto
          </Link>
        </div>
      </div>
    </div>
  )
}