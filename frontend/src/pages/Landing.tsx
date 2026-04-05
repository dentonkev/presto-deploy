import { useNavigate } from 'react-router-dom';

const Landing = () => {
	const navigate = useNavigate();
	const loginClick = () => navigate("/login");
	const registerClick = () => navigate("/register");


   return (
		<main className='flex flex-col items-center justify-center h-screen gap-4'>
			<h1 className='text-4xl text-bold'>Presto</h1>
			<div className='flex flex-col gap-4'>
				<button onClick={loginClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
				Login
				</button>
				<button onClick={registerClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
					Register
				</button>
			</div>
		</main>
   );
};
 
export default Landing;