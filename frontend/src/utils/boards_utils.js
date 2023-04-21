import api from '../api'

const getBoardData = ({ id, setGroup, navigate }) => {
    api.getBoardData(id)
        .then(res => {
            setGroup(res);
            navigate(`/board/${id}/`);
        })
        .catch(err => {
            const errors = Object.values(err);
            if (errors) {
                alert(errors.join(', '));
            }
        });
};
const getBoardsData = (setBoards) => {
    api.getboards()
        .then(res => {
            setBoards(res)
        }).catch(errors => {
            if (errors) {
                alert(errors.join(', '))
            }
        })
}

export { getBoardsData, getBoardData }




