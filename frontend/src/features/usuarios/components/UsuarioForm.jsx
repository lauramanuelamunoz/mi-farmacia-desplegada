import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  nombre: yup.string().required('Nombre requerido').min(3, 'Mínimo 3 caracteres'),
  email: yup.string().email('Email inválido').required('Email requerido'),
  password: yup.string()
    .when('isEdit', {
      is: false,
      then: schema => schema.required('Contraseña requerida').min(6, 'Mínimo 6 caracteres'),
      otherwise: schema => schema.nullable(),
    }),
  rol: yup.string().required('Rol requerido'),
});

const UsuarioForm = ({ initialData, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { ...initialData, isEdit: !!initialData }
  });

  useEffect(() => {
    if (initialData) {
      reset({ ...initialData, isEdit: true });
    } else {
      reset({ isEdit: false });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre *
        </label>
        <input
          {...register('nombre')}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.nombre && (
          <p className="text-sm text-red-600 mt-1">{errors.nombre.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      {!initialData && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña *
          </label>
          <input
            {...register('password')}
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rol *
        </label>
        <select
          {...register('rol')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="usuario">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        {errors.rol && (
          <p className="text-sm text-red-600 mt-1">{errors.rol.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          {initialData ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default UsuarioForm;