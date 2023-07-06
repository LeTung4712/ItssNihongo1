import React from 'react';
import styles from './ListNanny.module.scss';
import { useParams } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, styled } from '@mui/material';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import axios from 'axios';

const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function DetailNanny() {
    const [nannys, setNannys] = React.useState([]);
    const { id } = useParams();
    var isLogin = localStorage.getItem('isLogin');

    const [open, setOpen] = React.useState(false);

    const [value, setValue] = React.useState(2);
    const [isBooking, setIsBooking] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [review, setReview] = React.useState('');

    // Lấy giá trị ngày hôm nay
    let today = new Date();
    console.log(today);

    // Lấy giá trị ngày mai
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    console.log(tomorrow);

    React.useEffect(() => {
        const fetchData = async () => {
            const reponse = await fetch(
                'https://babybuddies-be-dev.onrender.com/api/v1/home?fbclid=IwAR0YWt_3e9gKOT4E6uDFFe5aQl4lZ6GMheji7DLbuXTORu1V2j5x8JUrDQQ',
            );
            const reponseJSON = await reponse.json();
            setNannys(reponseJSON.result.staffs);
        };
        fetchData();
    }, []);

    const nanny = nannys.find((nanny) => nanny.id === id);

    function getNannyLanguages(nanny) {
        if (nanny) {
            return nanny.user_language.map(function (lang) {
                return lang.name;
            });
        }
    }
    var nannyLanguages = getNannyLanguages(nanny);
    var nannyLanguagesString = nannyLanguages ? nannyLanguages.join(', ') : '';

    // format số tiền 100000 => 100,000
    function formatNumber(number) {
        const formattedNumber = number.toLocaleString('en-US');
        return formattedNumber;
    }

    function calculateAverageRating(reviews) {
        var totalStars = 0;
        var totalReviews = reviews.length;

        for (var i = 0; i < totalReviews; i++) {
            totalStars += reviews[i].star;
        }

        var averageRating = totalStars / totalReviews;
        if (totalReviews === 0) return 0;
        else return averageRating;
    }

    function FeedBack() {
        console.log(value);
        console.log(review);
        const url = 'https://babybuddies-be-dev.onrender.com/api/v1/ratings/staff/' + id ;
        console.log(url);
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "star": value,
                "review": review,
            }),
        }).then(() => {
            //load lai phan danh gia cua nanny sau khi post
            const fetchData = async () => {
                const reponse = await fetch(
                    'https://babybuddies-be-dev.onrender.com/api/v1/home?fbclid=IwAR0YWt_3e9gKOT4E6uDFFe5aQl4lZ6GMheji7DLbuXTORu1V2j5x8JUrDQQ',
                );
                const reponseJSON = await reponse.json();
                setNannys(reponseJSON.result.staffs);
            }
            fetchData();
            //dong modal
            handleClose();
        });
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const BookingButton = styled(Button)({
        backgroundColor: '#007320',
        fontSize: '24px',
        margin: 5,
        width: '200px',
        height: '40px',
        textTransform: 'none',
        color: '#ffffff',
        '&:hover': {
            backgroundColor: '#339966',
            color: '#000000',
        },
    });

    const FeedbackButton = styled(Button)({
        backgroundColor: 'red',
        margin: 5,
        fontSize: '24px',
        width: '200px',
        height: '40px',
        textTransform: 'none',
        color: '#ffffff',
        '&:hover': {
            backgroundColor: '#e64747',
            color: '#000000',
        },
    });

    const MyButton = styled(Button)({
        backgroundColor: '#c1bebe',
        color: '#000000',
        borderRadius: '20px',
        paddingLeft: '30px',
        paddingRight: '30px',
        textTransform: 'none',
        '&:hover': {
            backgroundColor: '#bfbaba',
        },
    });

    const blue = {
        100: '#DAECFF',
        200: '#b6daff',
        400: '#3399FF',
        500: '#007FFF',
        600: '#0072E5',
        900: '#003A75',
    };

    const grey = {
        50: '#f6f8fa',
        100: '#eaeef2',
        200: '#d0d7de',
        300: '#afb8c1',
        400: '#8c959f',
        500: '#6e7781',
        600: '#57606a',
        700: '#424a53',
        800: '#32383f',
        900: '#24292f',
    };

    const StyledTextarea = styled(TextareaAutosize)(
        ({ theme }) => `
        width: 770px;
        font-family: IBM Plex Sans, sans-serif;
        font-size: 0.875rem;
        font-weight: 400;
        line-height: 1.5;
        padding: 12px;
        border-radius: 12px;
        color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
        background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
        border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
        box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
      
        &:hover {
          border-color: ${blue[400]};
        }
      
        &:focus {
          border-color: ${blue[400]};
          box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[500] : blue[200]};
        }
      
        // firefox
        &:focus-visible {
          outline: 0;
        }
      `,
    );

    const handleBooking = () => {
        console.log(nanny);
        const formData = {
            staffId: nanny.id,
            endDay: tomorrow.toLocaleDateString(),
            message: message,
            total: nanny.salary,
            startDay: today.toLocaleDateString(),
        };
        axios.post('https://babybuddies-be-dev.onrender.com/api/v1/bookings/store', formData).then(() => {
            setIsBooking(false);
            setMessage('')
        });
    };

    return (
        <div>
            {/* {nanny && isLogin && ( */}
            {nanny && (
                <div>
                    <Box
                        display={isBooking ? 'flex' : 'none'}
                        position={'fixed'}
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        alignItems={'center'}
                        justifyContent={'center'}
                        backgroundColor={'rgba(0, 0, 0, 0.5)'}
                        zIndex={1000}
                    >
                        <Box
                            width={'50%'}
                            backgroundColor={'white'}
                            borderRadius={'6px'}
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                        >
                            <Box width={'90%'}>
                                <h1 style={{ color: '#007320' }}>Confirm booking</h1>
                                <h4 style={{ color: '#007320' }}>Staff Name</h4>
                                <Box
                                    sx={{
                                        backgroundColor: '#d6d6d6',
                                        fontSize: '24px',
                                        borderRadius: '6px',
                                        padding: '2px',
                                    }}
                                >
                                    {nanny.full_name}
                                </Box>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ width: '49%' }}>
                                        <h4 style={{ color: '#007320' }}>Start day</h4>
                                        <Box
                                            sx={{
                                                backgroundColor: '#d6d6d6',
                                                fontSize: '24px',
                                                borderRadius: '6px',
                                                padding: '2px',
                                            }}
                                        >
                                            {today.toLocaleDateString()}
                                        </Box>
                                    </div>
                                    <div style={{ width: '49%' }}>
                                        <h4 style={{ color: '#007320' }}>Finish day</h4>
                                        <Box
                                            sx={{
                                                backgroundColor: '#d6d6d6',
                                                fontSize: '24px',
                                                borderRadius: '6px',
                                                padding: '2px',
                                            }}
                                        >
                                            {tomorrow.toLocaleDateString()}
                                        </Box>
                                    </div>
                                </div>
                                <h4 style={{ color: '#007320' }}>Total price</h4>
                                <Box
                                    sx={{
                                        width: '49%',
                                        backgroundColor: '#d6d6d6',
                                        fontSize: '24px',
                                        borderRadius: '6px',
                                        padding: '2px',
                                        marginBottom: '18px',
                                    }}
                                >
                                    {formatNumber(nanny.salary)} VND
                                </Box>
                                {/* <TextField
                                    multiline
                                    maxRows={4}
                                    sx={{margin: '10px 0', width: '80%'}}
                                /> */}
                                <textarea
                                    name="des"
                                    id=""
                                    cols="30"
                                    rows="6"
                                    placeholder="Write a sentence you want to send to the staff"
                                    value={message}
                                    onChange={(e) => {
                                        setMessage(e.target.value);
                                    }}
                                    style={{ width: '100%', fontSize: '14px', padding: '10px', marginBottom: '10px' }}
                                ></textarea>
                                <Box display={'flex'} justifyContent={'space-around'} paddingBottom={'24px'}>
                                    <Button
                                        sx={{
                                            backgroundColor: '#007320',
                                            fontWeight: '600',
                                            borderRadius: '15px',
                                            width: '160px',
                                        }}
                                        variant="contained"
                                        onClick={handleBooking}
                                    >
                                        Confirm
                                    </Button>
                                    <Button
                                        sx={{
                                            backgroundColor: '#E5E5E5',
                                            fontWeight: '600',
                                            color: '#007320',
                                            borderRadius: '15px',
                                            width: '160px',
                                        }}
                                        variant="outline"
                                        onClick={() => {
                                            setIsBooking(false);
                                            setMessage('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <div className={styles.container1}>
                        <div className={styles.leftBox}>
                            <label className={styles.labelName}>Name</label>
                            <span className={styles.inputField}>
                                <p className={styles.inputFieldText}>{nanny.full_name}</p>
                            </span>

                            <label className={styles.labelName}>Gender</label>
                            <ul>
                                <li className={styles.font24}>{nanny.gender}</li>
                            </ul>

                            <label className={styles.labelName}>Birthday</label>
                            <span className={styles.inputField}>
                                <p className={styles.inputFieldText}>{nanny.birthday}</p>
                            </span>

                            <label className={styles.labelName}>Address</label>
                            <span className={styles.inputField}>
                                <p className={styles.inputFieldText}>{nanny.address}</p>
                            </span>

                            <label className={styles.labelName}>Experience of Cooking</label>
                            <span className={styles.inputField}>
                                <p className={styles.inputFieldText}>{nanny.cook_exp} of experience</p>
                            </span>

                            <label className={styles.labelName}>Experience of Child Care</label>
                            <span className={styles.inputField}>
                                <p className={styles.inputFieldText}>{nanny.care_exp} of experience</p>
                            </span>

                            <label className={styles.labelName}>Languages</label>
                            <span className={styles.inputField}>
                                <p className={styles.inputFieldText}>{nannyLanguagesString}</p>
                            </span>

                            <label className={styles.labelName}>Price</label>
                            <span className={styles.staffPrice}> {formatNumber(nanny.salary)} VND/day</span>
                        </div>

                        <div className={styles.rightBox}>
                            <div className={styles.imgDiv}>
                                <img className={styles.staffImg} src={nanny.image_link} alt="" />
                            </div>
                            <div className={styles.starList}>
                                <Rating
                                    style={{color: '#0d520d'}}
                                    name="read-only"
                                    value={calculateAverageRating(nanny.rating)}
                                    readOnly
                                    precision={0.5}
                                    sx={{ fontSize: '58px' }}
                                />
                            </div>
                            <div className={styles.BookOrReport}>
                                <Box sx={{ marginLeft: '150px' }}>
                                    <BookingButton
                                        variant="contained"
                                        sx={{ marginRight: '100px' }}
                                        onClick={() => {
                                            setIsBooking(true);
                                        }}
                                    >
                                        Booking
                                    </BookingButton>
                                    <FeedbackButton variant="contained" onClick={handleOpen}>
                                        Feedback
                                    </FeedbackButton>
                                </Box>
                                <Modal
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    {/* Modal Feedback */}
                                    <Box sx={style} borderRadius={5} border="1px solid">
                                        <Typography
                                            id="modal-modal-title"
                                            variant="h6"
                                            component="h2"
                                            fontWeight="bold"
                                            fontSize="28px"
                                        >
                                            Feedback
                                        </Typography>
                                        <Typography id="modal-modal-description" sx={{ mt: 2 }} fontWeight="bold">
                                            Rating :
                                        </Typography>
                                        <Typography sx={{ marginLeft: 8 }}>
                                            <Rating
                                                size="large"
                                                name="simple-controlled"
                                                value={value}
                                                onChange={(event, newValue) => {
                                                    setValue(newValue);
                                                }}
                                            />
                                        </Typography>

                                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                        <textarea
                                                style = {{width: '90%', height: '100px', borderRadius: '20px', padding: '25px',marginLeft: '15px',}}
                                                aria-label="empty textarea"
                                                placeholder="Write comment"
                                                minRows={3} 
                                                value =  {review}
                                                onChange= {e => setReview(e.target.value)}
                                            />
                                        </Typography>

                                        <Typography
                                            sx={{
                                                marginTop: '20px',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                display: 'flex',
                                            }}
                                        >
                                            <MyButton onClick={FeedBack} sx={{ marginRight: '25px' }}>Submit</MyButton>
                                            <MyButton onClick={handleClose}>Cancel</MyButton>
                                        </Typography>
                                    </Box>
                                </Modal>
                            </div>
                        </div>
                    </div>
                    <div className={styles.container2}>
                        <span
                            style={{
                                fontWeight: 'bold',
                                marginLeft: '4px',
                                fontSize: '20px',
                                display: 'block',
                                width: '100%',
                            }}
                        >
                            Write comment
                        </span>
                        <textarea
                            style={{
                                boxSizing: 'border-box',
                                width: '100%',
                                height: '102px',
                                backgroundColor: '#94c594',
                                border: 'none',
                            }}
                        ></textarea>
                    </div>
                    <span className={styles.commentText}>previous comment</span>
                    <div className={styles.container3}>
                        {nanny &&
                            nanny.rating.map((item, index) => (
                                <div key={index} className={styles.prevComment}>
                                    <span style={{ fontWeight: 'bold', marginLeft: '16px' }}>
                                        {item.star}
                                        <span className={styles.greenStar2}>&#9733;</span>
                                    </span>
                                    <br />
                                    <span style={{ marginLeft: '16px', display: 'block', marginBottom: '12px' }}>
                                        {item.review}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
