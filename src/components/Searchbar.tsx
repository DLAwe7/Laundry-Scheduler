import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./Searchbar.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



type SearchbarProps = {
    searchTerm: string;
    onSearch: React.Dispatch<React.SetStateAction<string>>;
    inputId: string;
    inputTitle: string;
}

function Searchbar({ searchTerm, onSearch, inputId, inputTitle }: SearchbarProps) {

    const handleOnSearch = (input: string) => {

        onSearch(input);

    };





    return (

        <div className="search-filter-wrapper">

            <label htmlFor={inputId} className={"shared-searchbar-icon magnifying-wrapper"}>

                <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" />
                <span className="sr-only">{inputTitle}</span>

            </label>


            <input type="search" id={inputId} placeholder="Search..." title={inputTitle} autoComplete="off"
                value={searchTerm} onChange={(e) => handleOnSearch(e.target.value)} className="shared-searchbar-input"

            />


            {searchTerm?.length > 0 &&

                <div className="shared-searchbar-icon searchbar-input-clearer">

                    <button onClick={() => handleOnSearch("")} aria-label="Clear Searchbar" type="button">

                        <FontAwesomeIcon icon={faXmark} aria-hidden="true" />


                    </button>

                </div>}
        </div>
    );

};

export default Searchbar;