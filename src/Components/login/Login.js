import React, { useState } from "react";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { useAuth } from '../../Context/Authcontext'; // Importa el contexto de autenticación
import { Link, useNavigate } from 'react-router-dom'; // useNavigate para la redirección

export default function LoginForm() {
  const { login } = useAuth(); // Obtén la función de login del contexto
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null); // Manejo de errores
  const navigate = useNavigate(); // Hook para redirigir después del login

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpiar error antes de intentar iniciar sesión
    try {
      await login(email, password); // Inicia sesión con el email y la contraseña
      navigate("/dashboard"); // Redirigir al Dashboard tras inicio de sesión exitoso
    } catch (error) {
      setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
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
              {error && <p className="text-red-500 text-sm">{error}</p>} {/* Muestra el error si existe */}
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600" type="submit">
                Iniciar sesión
              </Button>
            </div>
          </form>
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
