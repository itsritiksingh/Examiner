import React from 'react'
import { Card } from 'antd'
const { Meta } = Card;
export const SimpleCard = ({ title, totalQuestion,index,...rest }) => {
    return (
        <>
            <Card
            {...rest}
                hoverable
                style={{ width: 240,display:"inline-block",margin: "30px" }}
                cover={<img alt="example" src={`https://cdn.pixabay.com/photo/2017/10/03/20/30/book-2814026_1280.jpg`} />}
            >
                <Meta title={title} description={`total Question: ${totalQuestion}`} />
            </Card>
        </>
    )
}
