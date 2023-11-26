import { useState, useEffect } from 'react';
import { GridPostList } from '@/components/shared';
import { useUserContext } from '@/hooks/useUserContext';
import { useGetSavedPostsQuery } from '@/lib/react-query/queriesAndMutations';
import { Loader } from 'lucide-react';
import { Models } from 'appwrite';

const SavedPosts = () => {
  const { user } = useUserContext();
  const { data: savedPosts, isLoading } = useGetSavedPostsQuery(user.id);
  const [posts, setPosts] = useState<Models.Document[]>([]);

  useEffect(() => {
    if (savedPosts) {
      const filteredPosts = savedPosts.documents.map((item) => item.post);
      setPosts(filteredPosts);
    }
  }, [savedPosts]);
  return isLoading ? (
    <div className='flex justify-center items-center w-full h-full'>
      <Loader />
    </div>
  ) : (
    <div className='flex flex-1'>
      <div className='flex flex-col flex-1 items-center gap-8 w-full px-5 py-10 md:px-8 lg:p-14 overflow-scroll custom-scrollbar'>
        <div className='flex gap-2 items-center justify-start w-full'>
          <img src='/assets/icons/save.svg' alt='Save' width={36} height={36} />
          <h3 className='font-bold text-[24px] md:text-[30px] leading-[140%] tracking-tight'>
            Saved Posts
          </h3>
        </div>
        <div className='w-full'>
          <GridPostList posts={posts} showStats={false} />
        </div>
      </div>
    </div>
  );
};

export default SavedPosts;
