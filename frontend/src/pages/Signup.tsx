import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { BookOpen } from 'lucide-react';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const fullName = `${firstName} ${lastName}`.trim();
        localStorage.setItem('narrative_username', fullName);

        setTimeout(() => {
            setIsLoading(false);
            navigate('/new');
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
            <div className="relative w-full max-w-md space-y-8">

                {/*  Glow layer */}
                <div className="absolute inset-0 -z-10 
                    bg-gradient-to-r from-indigo-500/30 via-fuchsia-500/30 to-cyan-500/30 
                    blur-3xl rounded-full"
                />

                {/* Header */}
                    <div className="flex flex-col items-center text-center">
                        <div className="p-3 bg-primary rounded-xl mb-4">
                            <BookOpen className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Start co-writing your masterpiece today
                        </p>
                    </div>
                

                {/* Glass Card */}
                <div className="p-8 rounded-2xl backdrop-blur-xl bg-primary/10 border border-white/20 shadow-[0_0_40px_rgba(99,102,241,0.25)]">
                    <form className="space-y-6" onSubmit={handleSignup}>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First name"
                                type="text"
                                placeholder="Jane"
                                required
                                className="bg-background"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <Input
                                label="Last name"
                                type="text"
                                placeholder="Doe"
                                required
                                className="bg-background"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <Input
                            label="Email address"
                            type="email"
                            placeholder="name@example.com"
                            required
                            className="bg-background"
                        />

                        <Input
                            label="Password"
                            type="password"
                            required
                            className="bg-background"
                        />

                        <Button
                            type="submit"
                            size="lg"
                            isLoading={isLoading}
                            className="
                                w-full transition-all duration-300
                                shadow-[0_0_20px_rgba(99,102,241,0.4)]
                                hover:shadow-[0_0_35px_rgba(139,92,246,0.7)]
                                hover:scale-[1.02]
                                active:scale-95
                                active:shadow-[0_0_50px_rgba(99,102,241,0.9)]
                            "
                        >
                            Create account
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
            <div className="text-center">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary/80 hover:text-primary transition-colors">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
};

export default Signup;
