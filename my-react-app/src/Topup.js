import React from 'react'

const Topup = () => {
  return (
    <div>
    <div class="container">
        <div class="navbar">
            <div class="logo"> 
                <a href="index.html"><img src=" " width="250px"/></a>
            </div>
            <nav>
                <ul id="MenuItems">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="/product/product.html">Product</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="account.html">Account</a></li>
                </ul>
            </nav>
            <a href=" "><img src="images/cart.png" width="30px" height="30px"/></a>
            <img src="images/menu.png" class="menu-icon" onclick="menutoggle()"/>
       </div>
    </div>

<div class="small-container">
    <div class="account">
        <div class="profile">
            <div class="profile-detail">
                <div class="profile-pic">
                <img src="images/profile-pic.jpg" id="photo">
                <input type="file" id="file">
                <label for="file" id="uploadBtn">Choose Photo</label>
            </div>
                <h3 id="username"></h3>
                <p id="email"></p>
            </div>
            <ul>
                <li><a href="account.html" class="active">My Account<span>></span></a></li>
                
                
                <li><a href="">Delete Account<span>></span></a></li>
                <li><a href="#" id = "logout">Logout<span>></span></a></li>
            </ul>
        </div>
        <div class="account-detail">
            <h2>Account</h2>    
            <div class="billing-detail">					
                <form class="checkout-form">
                    <div class="form-inline">
                        <div class="form-group">
                            <label>UserName</label>
                            <input type="text" id="uname" name="uname" value="">
                        </div>
                    </div>
                    <div class="form-inline">
                        <div class="form-group">
                            <label>Country</label>
                            <select id="country" name="country">
                                <option selected>---Select a Country---</option>
                                <option value="philippines">Philippines</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>City</label>
                            <select id="city" name="city">
                                <option selected>---Select a City---</option>
                                <option value="caloocan">Caloocan</option>
                                <option value="las-pinas">Las Piñas</option>
                                <option value="makati">Makati</option>
                                <option value="malabon">Malabon</option>
                                <option value="mandaluyong">Mandaluyong</option>
                                <option value="manila">Manila</option>
                                <option value="marikina">Marikina</option>
                                <option value="muntinlupa">Muntinlupa</option>
                                <option value="navotas">Navotas</option>
                                <option value="paranaque">Parañaque</option>
                                <option value="pasay">Pasay</option>
                                <option value="Pasig">Pasig</option>
                                <option value="Pateros">Pateros</option>
                                <option value="quezon-city">Quezon City</option>
                                <option value="san-juan">San Juan</option>
                                <option value="taguig">Taguig</option>
                                <option value="valenzuela">Valenzuela</option>

                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Address</label>
                        <textarea style="resize:none" id="address" name="address" rows="3"></textarea>
                    </div>
                    <div class="form-inline">					
                        <div class="form-group">
                            <label>Tel</label>
                            <input type="text" id="tel" name="tel" minlength="11" maxlength="11" value="">
                        </div>
                        <div class="form-group">
                            <label>Mobile</label>
                            <input type="text" id="mobile" name="mobile" minlength="11" maxlength="11" value=""/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label></label>
                        <input type="submit" id="update" name="update" value="Update"/>
                    </div>
                </form>		
            </div>
        </div>
    </div>
 </div>
 <div class="footer">
        <div class="container">
            <div class="row">
                <div class="footer-col-1">
                    <h3>Subscribe to our news</h3>
                    <input type="email" placeholder="Your Email address"/>
                    <button>Subscribe</button>
                </div>
                <div class="footer-col-2">
                    <img src="images/logo.png" width="300px"/>
                </div>
                <div class="footer-col-3">
                    <h3>Useful Links</h3>
                    <ul>
                        <li><a href="#">Coupon</a></li>
                        <li><a href="#">Blog post</a></li>
                        <li><a href="#">Return Policy</a></li>
                        <li><a href="#">Join Affiliate</a></li>
                    </ul>
                </div>
                <div class="footer-col-4">
                    <h3>Follow us</h3>
                    <ul>
                        <li><a href="https://www.facebook.com/serbaelconceptstore">Facebook</a></li>
                        <li><a href="#">Instagram</a></li>
                        <li><a href="#">Tiktok</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div> 
</div>
  )
}

export default Topup;
