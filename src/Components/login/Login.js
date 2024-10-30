import React, { useState } from "react";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { useAuth } from '../../Context/Authcontext'; // Importa el contexto de autenticación
import { Link, useNavigate } from 'react-router-dom'; // useNavigate para la redirección
import { toast } from 'react-toastify'; // Para notificaciones
import 'react-toastify/dist/ReactToastify.css'; // Estilos de Toastify

export default function LoginForm() {
  const { login } = useAuth(); // Obtén la función de login del contexto
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null); // Manejo de errores
  const [loading, setLoading] = useState(false); // Manejo de la carga
  const navigate = useNavigate(); // Hook para redirigir después del login

  // Alternar visibilidad de la contraseña
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Manejar el submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpiar errores anteriores
    setLoading(true); // Iniciar el estado de carga

    try {
      await login(email, password); // Inicia sesión con el email y la contraseña
      navigate("/dashboard"); // Redirigir al Dashboard tras inicio de sesión exitoso
    } catch (error) {
      // Manejar diferentes errores de Firebase
      if (error.code === 'auth/wrong-password') {
        setError("Contraseña incorrecta.");
      } else if (error.code === 'auth/user-not-found') {
        setError("No se encontró una cuenta con este correo.");
      } else {
        setError("Error al iniciar sesión. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false); // Detener el estado de carga
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-black text-white shadow-xl rounded-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <ShoppingBag className="h-12 w-12 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
          <CardDescription>
            Accede a tu tienda y gestor de inventario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Input para el email */}
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input 
                  id="email" 
                  placeholder="tu@email.com" 
                  type="email" 
                  required 
                  className="mt-1" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} // Maneja el cambio de email
                />
              </div>

              {/* Input para la contraseña */}
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} // Maneja el cambio de contraseña
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Mostrar el error si existe */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Botón para enviar el formulario */}
              <Button 
                className="w-full bg-yellow-500 hover:bg-yellow-600" 
                type="submit"
                disabled={loading} // Deshabilitar el botón si está en estado de carga
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </div>
          </form>

          {/* Enlace para restablecer la contraseña */}
          <div className="mt-4 text-center text-sm text-gray-300">
            <Link to="/reset-password" className="text-yellow-500 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link> 
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
