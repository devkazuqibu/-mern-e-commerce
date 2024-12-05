import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";
import { useEffect } from "react";
// Thành phần đăng ký người dùng
const SignUpPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		phone: "",   // Thêm trường phone
		address: "",
		confirmPassword: "",
	 // Thêm trường address
	});
	const { signup, loading } = useUserStore();
	useEffect(() => {
/*************  ✨ Codeium Command ⭐  *************/
	/**
	 * X  lý khi ng i d ng g i form
	 * 
	 * @param {Event} e - S ki n t i form
	 */
/******  04117647-0ee5-4024-bba2-369e37bcd2fe  *******/		const script = document.createElement("script");
		script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?compat=recaptcha";
		script.async = true;
		script.defer = true;
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		signup(formData);
	};
	
	
	
	return (
		<div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<motion.div
				className="sm:mx-auto sm:w-full sm:max-w-md"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
					Create your account
				</h2>
			</motion.div>

			<motion.div
				className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				<div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<form onSubmit={handleSubmit} className="space-y-6">
						
						{/* Trường nhập tên */}
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-gray-300">
								Full name
							</label>
							<div className="mt-1 relative rounded-md shadow-sm">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<User className="h-5 w-5 text-gray-400" aria-hidden="true" />
								</div>
								<input
									id="name"
									type="text"
									required
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
									placeholder="Jack 97 bocon"
								/>
							</div>
						</div>

						{/* Trường nhập email */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-300">
								Email address
							</label>
							<div className="mt-1 relative rounded-md shadow-sm">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
								</div>
								<input
									id="email"
									type="email"
									required
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
									placeholder="you@example.com"
								/>
							</div>
						</div>

						{/* Trường nhập số điện thoại */}
						<div>
    <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
        Phone Number
    </label>
    <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
            id="phone"
            type="tel"  // Chuyển từ 'text' sang 'tel'
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            placeholder="123-456-7890"
            pattern="\d{3}[-]\d{3}[-]\d{4}" // Kiểm tra định dạng xxx-xxx-xxxx
        />
    </div>
</div>


						{/* Trường nhập địa chỉ */}
						<div>
							<label htmlFor="address" className="block text-sm font-medium text-gray-300">
								Address
							</label>
							<div className="mt-1 relative rounded-md shadow-sm">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<User className="h-5 w-5 text-gray-400" aria-hidden="true" />
								</div>
								<input
									id="address"
									type="text"
									required
									value={formData.address}
									onChange={(e) => setFormData({ ...formData, address: e.target.value })}
									className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
									placeholder="123 Main St, City, Country"
								/>
							</div>
						</div>

						{/* Trường nhập mật khẩu */}
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-300">
								Password
							</label>
							<div className="mt-1 relative rounded-md shadow-sm">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
								</div>
								<input
									id="password"
									type="password"
									required
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
									placeholder="••••••••"
								/>
							</div>
						</div>

						{/* Trường nhập xác nhận mật khẩu */}
						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
								Confirm Password
							</label>
							<div className="mt-1 relative rounded-md shadow-sm">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
								</div>
								<input
									id="confirmPassword"
									type="password"
									required
									value={formData.confirmPassword}
									onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
									className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
									placeholder="••••••••"
								/>
							</div>
						</div>
						<div className='cf-turnstile' data-sitekey='0x4AAAAAAA1h2CT9lL1cuwBy'></div>

						{/* Nút đăng ký */}
						<button
							type="submit"
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
									Loading...
								</>
							) : (
								<>
									<UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
									Sign up
								</>
							)}
						</button>
					</form>

					<p className="mt-8 text-center text-sm text-gray-400">
						Already have an account?{" "}
						<Link to="/login" className="font-medium text-emerald-400 hover:text-emerald-300">
							Login here <ArrowRight className="inline h-4 w-4" />
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};

export default SignUpPage;
