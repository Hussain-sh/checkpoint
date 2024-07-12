export default function Unauthorised() {
	return (
		<div className="w-full flex flex-col justify-center items-center gap-5 py-12">
			<h1 className="text-4xl font-extrabold text-infoDark">Unauthorized</h1>
			<p className="text-xl text-primary">
				You are not authorised to access this page
			</p>
		</div>
	);
}
