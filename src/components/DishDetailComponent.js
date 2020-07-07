import React, { Component } from 'react';
import { Card, CardImg, CardTitle, CardBody, CardText, Breadcrumb, BreadcrumbItem, Button, Modal, ModalBody, ModalHeader, Row, Label, Col } from 'reactstrap'; 
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors} from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';


function RenderComments({comments}) {
        
    const renderedComments = comments.map((com) => {
           return (
            <Fade in>
                <div className="container">
                <div key = {com.id} >
                    <ul class = "list-unstyled">
                        <li>{com.comment}</li>
                        <br></br>   
                        <li>-- {com.author} {new Intl.DateTimeFormat('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: '2-digit'
                                }).format(new Date(com.date))}
                        </li>
                    </ul>
                </div> 
            </div>
            </Fade>
            );
        }); 
        if (comments != null) {
            return renderedComments;
         } else {
        return (
            <div></div>
        );
    }
       
}
    
function RenderDish({dish}) {
            return (
                <FadeTransform in
                    transformProps={{
                        exitTransform: 'scale(0.5) translateY(-50%)'
                    }}>
                    <Card>
                        <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                        <CardBody>
                            <CardTitle>{dish.name}</CardTitle>
                            <CardText>{dish.description}</CardText>
                        </CardBody>
                    </Card>
                </FadeTransform>

            );
}
    
function DishDetail(props) { 
    const dish = props.dish;
                if (props.isLoading) {
                    return (
                       <div className="container">
                           <div className="row">
                              <Loading></Loading>
                           </div>
                       </div> 
                    );
                } else if (props.errMess) {
                    return (
                        <div className="container">
                            <div className="row">
                                <h4>{props.errMess}</h4>
                            </div>
                        </div> 
                     );   
                }
                 else if (dish != null) {
                         return (
                            <div className = "container"> 
                                <div className="row">
                                    <Breadcrumb>
                                        <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                                    </Breadcrumb>
                                    <div className="col-12">
                                        <h3>{props.dish.name}</h3>
                                        <hr />
                                    </div>
                                </div>
                                <div className="row">   
                                     <div className = "col-12 col-md-5 m-1">
                                        <RenderDish dish={dish} />
                                     </div>
                                     <div className = "col-12 col-md-5 m-1">
                                         <h4>Comments</h4>
                                         <Stagger in>
                                        <RenderComments comments={props.comments} />
                                        </Stagger>
                                        <CommentForm postComment={props.postComment} dishId={props.dish.id}/>
                                     </div>
                                 </div>  
                            </div> 
                         );
                     } else {
                         return (
                             <div></div>
                         );
             }
}


            
                
export default DishDetail;

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            isModalOpen: false
          };
          this.toggleModal = this.toggleModal.bind(this);
          this.handleSubmit = this.handleSubmit.bind(this);
      }
  
        handleSubmit(values) {
            // console.log("Current State is:" + JSON.stringify(values));
            // alert("Current State is:" + JSON.stringify(values));
            this.toggleModal();
            this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
        }

  
        toggleModal() {
            this.setState({
              isModalOpen: !this.state.isModalOpen
            });
          }

        render() {
            return ( 
                <div>
                    <Button className="btn btn-outline" outline onClick={this.toggleModal}>
                    <span className="fa fa-pencil">  Submit Comment</span>
                    </Button>
                    <Modal isOpen = {this.state.isModalOpen} toggle = {this.toggleModal}>
                        <ModalHeader toggle = {this.toggleModal}>Submit Comment</ModalHeader>
                            <ModalBody> 
                                <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                                    <Row className="form-group">
                                    <Label htmlFor="rating" md={10}>Rating</Label>
                                        <Col md={{size : 12}}>
                                            <Control.select model=".rating"  name="rating" 
                                            className="form-control">
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                                <option>6</option>
                                                <option>7</option>
                                                <option>8</option>
                                                <option>9</option>
                                                <option>10</option>
                                            </Control.select>
                                        </Col>
                                    </Row>
                                    <Row className="form-group">
                                        <Label htmlFor="yourname" md={10}>Your Name</Label>
                                        <Col md={{size : 12}}>
                                            <Control.text model=".author"  id="yourname" name="yourname" placeholder="Your name" 
                                            className="form-control"
                                            validators= {{
                                                required, minLength:minLength(3), maxLength:maxLength(15)
                                            }}>
                                            </Control.text>
                                            <Errors className="text-danger" model=".author" show="touched" 
                                            messages={{
                                                required:'Required!',
                                                minLength:'Must be greater than 2 characters',
                                                maxLength:'Must be 15 characters or less'
                                            }}>
                                            </Errors>
                                        </Col>
                                    </Row>
                                    <Row className="form-group">
                                        <Label htmlFor="comment" md={10}>Comment</Label>
                                        <Col md={{size : 12}}>
                                            <Control.textarea model=".comment" id="comment" name="comment" rows="12" 
                                            className="form-control"></Control.textarea>
                                        </Col>
                                    </Row>
                                    <Button type="submit" value="submit" color="primary">Submit</Button>
                                </LocalForm>
                                </ModalBody>
                        </Modal> 
                    </div>
            );
        }
    }