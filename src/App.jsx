import "./App.css"
import { useState, useEffect } from "react"
import axios from "axios"
import PriceChart from "./components/PriceChart"

function App() {
	const [coins, setCoins] = useState([])
	const [filteredCoins, setFilteredCoins] = useState([])

	const [search, setSearch] = useState("")
	const [chartModal, setChartModal] = useState(null)

	useEffect(() => {
		axios.get(
			"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
		)
			.then((res) => {
				setCoins(res.data)
				setFilteredCoins(res.data)
			})
			.catch((err) => console.error(err))
	}, [])

	const handleSearch = (e) => {
		const searchTerm = e.target.value.toLowerCase()
		setSearch(searchTerm)

		const filtCoins = coins.filter(
			(coin) =>
				coin.name.toLowerCase().includes(searchTerm) ||
				coin.symbol.toLowerCase().includes(searchTerm)
		)

		setFilteredCoins(filtCoins)
	}

	return (
		<div className="flex flex-col justify-center items-center w-full">
			<div
				className={`flex flex-col justify-center items-center w-full ${
					chartModal ? "blur" : ""
				}`}
			>
				<h1 className="text-3xl font-bold mt-10">
					Cryptocoin Price Consultor
				</h1>
				<input
					type="text"
					placeholder="Search coin"
					className="p-3 rounded-lg border-1 border-gray-300 max-w-200  my-5"
					onChange={handleSearch}
					value={search}
				/>
				<small>
					{coins.length}/{filteredCoins.length}
				</small>
			</div>
			<div
				className={`flex justify-center items-center w-full ${
					chartModal ? "blur-xl" : ""
				}`}
			>
				<ul className="flex gap-3 w-2/3 flex-wrap p-5 justify-center group">
					{filteredCoins.map((coin) => (
						<li
							key={coin.id}
							className="border-1 rounded-lg text-gray-800 bg-gray-200 hover:cursor-pointer active:bg-green-300 flex items-center gap-2 hover:scale-105"
							onClick={() => setChartModal(coin.id)}
						>

							<img src={coin.image} alt="coin image" className="w-10 h-10 p-1 border-gray-500"/>
							<p className="p-2 font-semibold">{coin.name}</p>
						</li>
					))}
				</ul>
			</div>

			{chartModal && (
				<div className="absolute w-1/2 top-1/4">
					<p
						className="bg-red-400 px-2 rounded-lg text-2xl mb-2 w-1/6 text-center hover:cursor-pointer"
						onClick={() => setChartModal(null)}
					>
						X
					</p>
					<PriceChart coinId={chartModal} style="w-full" />
				</div>
			)}
		</div>
	)
}

export default App
