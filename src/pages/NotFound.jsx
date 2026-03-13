import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-md">
                <h1 className="text-9xl font-extrabold text-indigo-600">404</h1>
                <h2 className="mt-4 text-3xl font-bold text-gray-900 tracking-tight">Page not found</h2>
                <p className="mt-4 text-base text-gray-500">
                    Sorry, we couldn't find the page you're looking for. The route might be incorrect or the exam link may have expired.
                </p>
                <div className="mt-8">
                    <Link to="/">
                        <Button size="lg" className="px-8">
                            Go Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
