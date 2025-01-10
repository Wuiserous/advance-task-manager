import DeleteTaskButton from '../UI-Buttons/DeleteTaskButton';

export default function TaskMenuModal({id}) {

      return (
        <div className='flex absolute right-0 p-1 bottom-[-30px] bg-white flex-col items-center justify-center gap-2 w-20'>
            <DeleteTaskButton id={id} />
        </div>
      );
}