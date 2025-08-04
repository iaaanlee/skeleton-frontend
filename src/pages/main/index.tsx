import { useCreateNewUserHandler } from "../../hooks/useCreateNewUserHandler";
import { useRef } from "react";

export const MainPage = () => {
    const formRef = useRef<HTMLFormElement>(null);
    
    const { 
        handleCreateNewUser, 
        isPending, 
        isSuccess, 
        isError 
    } = useCreateNewUserHandler({
        onSuccess: () => {
            console.log('User created successfully!');
        },
        onError: (error) => {
            console.error('Error creating user:', error.message);
        }
    })

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        try {
            await handleCreateNewUser(formData);
            // 성공 시 폼 초기화
            if (formRef.current) {
                formRef.current.reset();
            }
        } catch (error) {
            // 에러는 커스텀 훅에서 처리됨
            console.error('Form submission error:', error);
        }
    }

    return (
        <div className="p-5 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Create New User</h1>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input 
                        type="text" 
                        name="name"
                        placeholder="Enter your name" 
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <input 
                        type="text" 
                        name="contactNumber"
                        placeholder="Enter your contact number" 
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <select 
                        name="gender"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div>
                    <input 
                        type="number" 
                        name="birthYear"
                        placeholder="Enter your birth year" 
                        required
                        min="1900"
                        max="2024"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <input 
                        type="number" 
                        name="weight"
                        placeholder="Enter your weight (kg)" 
                        required
                        min="0"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <input 
                        type="number" 
                        name="height"
                        placeholder="Enter your height (cm)" 
                        required
                        min="0"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <button 
                    type="submit"
                    disabled={isPending}
                    className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                        isPending 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    } text-white`}
                >
                    {isPending ? 'Creating...' : 'Submit'}
                </button>
            </form>

            {isSuccess && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center">
                    User created successfully!
                </div>
            )}

            {isError && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
                    Error creating user. Please try again.
                </div>
            )}
        </div>
    )
}