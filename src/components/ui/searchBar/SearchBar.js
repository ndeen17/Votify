import { BallotOutlined } from "@mui/icons-material";
import './searchBar.css';

export default function SearchBar({searchState}) {
	const [search , setSearch] = searchState;
	return (
		<div className='SearchBar'>
			<input value={search} onChange={(e)=>setSearch(e.target.value)}/>
			<span>
				<BallotOutlined/>
			</span>
		</div>
	);
}