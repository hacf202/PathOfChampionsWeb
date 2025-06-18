import React from "react";

function Footer() {
	return (
		<footer className='bg-gray-950 text-white py-6 text-xl font-bold'>
			<div className='max-w-[1200px] mx-auto px-6'>
				<div className='flex flex-col md:flex-row justify-between items-center'>
					{/* Thông tin bản quyền */}
					<div className='mb-4 md:mb-0'>
						<p>&copy; {new Date().getFullYear()} Developed by Evin</p>
					</div>

					{/* Liên kết */}
					<div className='flex space-x-6 mb-4 md:mb-0'>
						<a href='/' className='hover:text-blue-300'>
							Trang chủ
						</a>
						{/* Mạng xã hội (tùy chọn) */}
						<div className='flex space-x-4'>
							<a
								href='https://www.facebook.com/lkinh.djack/'
								target='_blank'
								rel='noopener noreferrer'
								className='hover:text-blue-300'
							>
								<span>Facebook</span>
							</a>
							<a
								href='https://www.youtube.com/@Evin0126'
								target='_blank'
								rel='noopener noreferrer'
								className='hover:text-blue-300'
							>
								<span>Youtube</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
