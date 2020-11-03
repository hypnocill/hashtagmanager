import AppStorage from "@/services/storage/AppStorage";

export type tCategory	= { [name: string]: boolean };
export type tCategories	= { [k: string]: tCategory };

/**
 * @todo	Refactor the data model
 * 				Make a new 'categories' key that will store ONLY category names
 * 				Use that when category names are needed without their corresponding data
 * 				Fetch data for each category only when necessary 
 */
export default class HashtagStorage
{
	private CATEGORY_PREFIX			= 'cat_';
	private LAST_CATEGORY_PREFIX	= 'last_category';
	private LAST_HASHTAG_LIMIT		= 'last_hashtag_limit';
	private ALREADY_VISITED			= 'already_visited';

	private storage: AppStorage;

	constructor( storage: AppStorage )
	{
		this.storage	= storage;
	}

	public getAlreadyVisited(): boolean
	{
		return Boolean( this.storage.get( this.ALREADY_VISITED ) );
	}

	public setAlreadyVisited(): void
	{
		this.storage.set( this.ALREADY_VISITED, true );
	}

	public getLastHashtagLimit(): number
	{
		return Number( this.storage.get( this.LAST_HASHTAG_LIMIT ) );
	}

	public setLastHashtagLimit( limit: number )
	{
		this.storage.set( this.LAST_HASHTAG_LIMIT, limit )
	}

	public getLastCategory(): string
	{
		return this.storage.get( this.LAST_CATEGORY_PREFIX );
	}

	public addCategory( category: string, content: tCategory )
	{
		this.storage.set( this.CATEGORY_PREFIX + category, content );
	}

	public addHashtag( category: string, hashtag: string, starred: boolean )
	{
		const categoryKey	= this.CATEGORY_PREFIX + category;
		const categoryData	= JSON.parse( this.storage.get( categoryKey ) );
		let updatedCategory	= { ...categoryData, [hashtag]: starred };

		this.storage.set( categoryKey, updatedCategory );
		this.storage.set( this.LAST_CATEGORY_PREFIX, category );
	}

	public updateHashtag( category: string, hashtag: string, starred: boolean )
	{
		const categoryKey		= this.CATEGORY_PREFIX + category;
		const categoryData		= JSON.parse( this.storage.get( categoryKey ) );
		categoryData[hashtag]	= starred;

		this.storage.set( categoryKey, categoryData );
	}

	public deleteHashtag( hashtag: string, category: string )
	{
		const categoryKey	= this.CATEGORY_PREFIX + category;
		const categoryData	= JSON.parse( this.storage.get( categoryKey ) );
		delete categoryData[hashtag];

		this.storage.set( categoryKey, categoryData );
	}

	public getCategory( id: string ): tCategory | null
	{
		return JSON.parse( this.storage.get( this.CATEGORY_PREFIX + id ) );
	}

	public getCategoryByCriteria( category: string, hashtagsLimit: number, random: boolean = false, categoryData: tCategory = null ): tCategory
	{
		const DEFAULT_LIMIT	= 100;

		if ( isNaN( hashtagsLimit ) || ! Number.isInteger( hashtagsLimit ) || hashtagsLimit > 100 || hashtagsLimit < 1 )
		{
			hashtagsLimit	= DEFAULT_LIMIT;
		}

		categoryData	= categoryData ?? this.getCategory( category );

		return this.getHashtagsByCriteria( categoryData, hashtagsLimit, random );
	}

	public deleteCategory( id: string ): void
	{
		this.storage.delete( this.CATEGORY_PREFIX + id );
	}

	public getCategories(): tCategories
	{
		const data							= this.storage.getAll();
		const allCategories: tCategories	= {};

		for ( const key in data )
		{
			if ( key.includes( this.CATEGORY_PREFIX ) )
			{
				const sanitizedKey			= key.replace( this.CATEGORY_PREFIX, '' )
				allCategories[sanitizedKey]	= JSON.parse( data[key] );
			}
		}

		return allCategories;
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	private splitHashtagNamesByFavorite( hashtagsData: tCategory ): string[][]
	{
		const favoriteHashtagNames		= [];
		const nonFavoritehashtagNames	= [];

		for ( const hashtag in hashtagsData )
		{
			const isFavorite	= hashtagsData[hashtag];

			if ( isFavorite )
			{
				favoriteHashtagNames.push( hashtag );
			}
			else
			{
				nonFavoritehashtagNames.push( hashtag );
			}
		}

		return [favoriteHashtagNames, nonFavoritehashtagNames];
	}

	private getLengthsOfSplitHashtagsByFavorite(
		favoriteHashtagNames: string[],
		nonFavoritehashtagNames: string[],
		limit: number
	): number[]
	{
		let favoriteHashtagLength	= limit;

		if ( limit > favoriteHashtagNames.length )
		{
			favoriteHashtagLength	= favoriteHashtagNames.length;
		}

		let nonFavoriteHashtagLength	= favoriteHashtagLength > 0 ? limit - favoriteHashtagLength : limit;

		if ( nonFavoriteHashtagLength > nonFavoritehashtagNames.length )
		{
			nonFavoriteHashtagLength	= nonFavoritehashtagNames.length;
		}

		return [favoriteHashtagLength, nonFavoriteHashtagLength];
	}

	private getHashtagsByCriteria( categoryData: tCategory, limit: number, random: boolean ): tCategory
	{
		const [favoriteHashtagNames, nonFavoritehashtagNames]
			= this.splitHashtagNamesByFavorite( categoryData );
		const [favoriteHashtagNamesLength, nonFavoriteHashtagNamesLength]
			= this.getLengthsOfSplitHashtagsByFavorite( favoriteHashtagNames, nonFavoritehashtagNames, limit );


		const randomFavoriteHashtags	= this.getFromArrayByCriteria( favoriteHashtagNames, favoriteHashtagNamesLength, random );
		const randomNonFavoriteHashtags	= this.getFromArrayByCriteria( nonFavoritehashtagNames, nonFavoriteHashtagNamesLength, random );

		const randomHashtagList: tCategory	= {};

		randomFavoriteHashtags.forEach( hashtag =>
			{
				randomHashtagList[hashtag]	= categoryData[hashtag];
			}
		);

		randomNonFavoriteHashtags.forEach( hashtag =>
			{
				randomHashtagList[hashtag]	= categoryData[hashtag];
			}
		);

		return randomHashtagList;
	}

	private getFromArrayByCriteria( arr: any[], desiredLength: number, random: boolean = false ): any[]
	{
		let result	= new Array( desiredLength );
		let len		= arr.length;
		const taken	= new Array( len );

		if ( desiredLength > len )
		{
			throw new RangeError( 'getRandomFromArray: more elements taken than available' );
		}
			
		while ( desiredLength -- )
		{
			const elementNumber 	= random ? Math.floor( Math.random() * len ) : desiredLength;
			result[desiredLength]	= arr[elementNumber in taken ? taken[elementNumber] : elementNumber];
			taken[elementNumber] 	= --len in taken ? taken[len] : len;
		}

		return result;
	}
}