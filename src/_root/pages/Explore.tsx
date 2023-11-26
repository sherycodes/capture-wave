import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useInView } from 'react-intersection-observer';
import {
  useGetSearchPostsQuery,
  useGetInfinitePostsQuery,
} from '@/lib/react-query/queriesAndMutations';
import SearchResults from '@/components/shared/SearchResults';
import useDebounce from '@/hooks/useDebounce';
import { Loader } from 'lucide-react';
import { GridPostList } from '@/components/shared';

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { ref, inView } = useInView();
  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data: searchedPosts, isFetching: isFetchingSearch } =
    useGetSearchPostsQuery(debouncedSearch);
  const {
    data: posts,
    hasNextPage,
    fetchNextPage,
  } = useGetInfinitePostsQuery();

  useEffect(() => {
    if (inView && !searchTerm) {
      fetchNextPage();
    }
  }, [inView]);

  if (!posts) {
    return (
      <div className='flex justify-center w-full items-center h-full'>
        <Loader />
      </div>
    );
  }
  const shouldShowSearchResults = searchTerm || '';
  const shouldShowPosts =
    !shouldShowSearchResults &&
    posts.pages.every((item) => item.documents.length === 0);
  console.log(shouldShowPosts);

  return (
    <div className='flex flex-col items-center overflow-scroll custom-scrollbar px-5 py-10 md:p-14 w-full'>
      <div className='flex flex-col gap-6 md:gap-9 w-full items-center'>
        <h3 className='font-bold text-[24px] text-light-1'>Search Posts</h3>
        <div className='flex gap-1 items-center px-4 w-full bg-dark-4 rounded-lg'>
          <img
            src='/assets/icons/search.svg'
            alt='Search'
            className='w-6 h-6'
          />
          <Input
            type='text'
            placeholder='Search'
            className='bg-dark-4 h-12 border-none placeholder:text-light-1 focus-visible:ring-0 focus-visible:ring-offset-0 ring-offset-0'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className='w-full flex justify-between items-center mt-16 mb-7'>
        <h3 className='font-bold text-[20px] md:text-[24px] text-light-1'>
          Popular Today
        </h3>
        <div className='flex gap-3 cursor-pointer items-center px-4 bg-dark-3 rounded-xl py-2'>
          <p className='text-sm text-light-2'>All</p>
          <img
            src='/assets/icons/filter.svg'
            alt='Filter'
            className='w-5 h-5'
          />
        </div>
      </div>
      <div className='flex flex-wrap gap-9 w-full'>
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isFetchingSearch}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <p className='text-light-4 mt-10 w-full text-center'>End of posts</p>
        ) : (
          posts.pages.map((item, index) => (
            <GridPostList
              posts={item.documents}
              key={index}
              // showStats={false}
            />
          ))
        )}
      </div>

      {hasNextPage && !searchTerm && (
        <div
          className='w-full flex items-center justify-center mt-10'
          ref={ref}
        >
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
