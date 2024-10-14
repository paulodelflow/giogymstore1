import React, { useState } from 'react';
import { useAuth } from '../../Context/Authcontext';
import { Button } from "../ui/button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { ShoppingBag } from "lucide-react";
import { Link } from 'react-router-dom'; 

export default function ResetPasswordForm() {
  const { resetPassword } = useAuth(); // Usa la función de resetPassword del AuthContext
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Estado para manejar errores
  const [success, setSuccess] = useState(false); // Estado para manejar éxito

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Limpiar cualquier error previo
    setSuccess(false); // Limpiar éxito previo
    try {
      await resetPassword(email);
      setSuccess(true); // Mostrar éxito si se envía correctamente
    } catch (error) {
      // Capturar el error lanzado desde resetPassword y mostrarlo
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-black text-white shadow-xl rounded-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <ShoppingBag className="h-12 w-12 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Restablecer Contraseña</CardTitle>
          <CardDescription>
            Ingresa tu correo para recibir el enlace de restablecimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  placeholder="tu@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading} // Desactivar el input mientras se carga
                  className="mt-1"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>} {/* Mostrar mensaje de error */}
              {success && <p className="text-green-500 text-sm">¡Enlace enviado! Revisa tu correo.</p>} {/* Mostrar mensaje de éxito */}
              <Button
                className="w-full bg-yellow-500 hover:bg-yellow-600"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm text-gray-300">
            <Link to="/" className="text-yellow-500 hover:underline">
              Volver al inicio de sesión
            </Link> 
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
