import React from 'react'
import { Link } from 'react-router-dom'
import './index.css'
interface Props {

}

const About = (props: Props) => {
    return (
        <div>
            {/* End header-Bottom */}
            <div className="container mt-5">
                <img src="http://skybooks.vn/wp-content/uploads/2016/02/logo.png" alt="" width="100%" />
            </div>
            <div className="container outstory mt-5 ">
                <div className="text-center">
                    <span className="fs-3">Câu chuyện <span style={{ color: '#f07c29' }}>Của chúng tôi</span></span>
                </div>
                <div className="d-flex">
                    <div className="col-4 outstory-span border-5 border-start ps-5 pe-5">
                        <span className="lh-lg">“Thương hiệu sách Skybooks là địa chỉ tin cậy cho các tác giả trẻ Việt Nam gửi gắm tác phẩm của mình. Với khẩu hiệu “Tôi trẻ, tôi đam mê”, chúng tôi luôn nỗ lực để mang đến cho độc giả những tác phẩm chất lượng từ các tác giả trẻ nổi bật cũng như giúp đỡ, tạo điều kiện cho các cây bút trẻ được đông đảo độc giả biết đến. Hãy để Skybooks trở thành người đưa đứa con tinh thần của bạn đến với công chúng!”</span>
                    </div>
                    <div className="col-8">
                        <div className="mt-2">
                            <span >Đôi lúc muốn được ôm ai đó thật lâu, chẳng cần phải là người mình có tình cảm, bất kỳ ai cũng được, vì có những lúc thật sự cảm thấy thiếu kết nối, thiếu yêu thương, thiếu ấm áp.</span>
                        </div>
                        <div className="mt-5">
                            <span className="fw-bold">Liêu Hà Trinh</span>
                            <div >Họa cuộc đời lên những vần thơ
Đây chắc hẳn không phải là một cái tên xa lạ với nhiều người. Nhưng bạn có biết, sự duyên dáng và thu hút của cô không chỉ được thể hiện qua vị trí của một MC show truyền hình mà còn cả trong những trang thơ cô viết?
Trau chuốt, cảm xúc, tinh tế và rất đời chính là những gì bạn sẽ tìm thấy trong thơ của Liêu Hà Trinh.
Cô đam mê viết lách nhưng còn có một niềm đam mê khác là kết nối được tâm hồn của những người phụ nữ có góc khuất trong tình yêu, trong cuộc sống. Có lẽ chính bởi điều này mà thơ của Liêu Hà Trinh lại được yêu thích và lan tỏa nhiều đến vậy.</div>
                        </div>
                        <div className="mt-5">
                            <span className="fw-bold">Hiên – Cô gái bình dị, kể những câu chuyện bình dị</span>
                            <div >Bắt đầu cầm bút từ những ngày đầu của tuổi đôi mươi, Hiên đã bỏ túi rất nhiều đầu sách và “lên duyên” với hàng vạn độc giả trẻ. Những ấn phẩm thơ nổi tiếng của cô phải kể đến: Xin chào tình yêu, Cứ mộng mơ đời sẽ nên thơ, Thế giới hiện đại con người cô đơn…
Với Hiên, nhiệm vụ của một cây viết không gì quan trọng hơn là truyền đạt được những điều tốt đẹp, đúng đắn đến mọi người xung quanh. Cô không viết theo xu hướng mà khai thác những góc nhìn rất riêng từ những điều giản đơn trong cuộc sống này.
Đọc thơ của Hiên tựa như đang ngồi trong một khu vườn nhỏ ngập nắng, được thả mình thư giãn và tận hưởng mọi xúc cảm dâng lên bên trong. Chính điều này đã khiến Hiên trở thành tác giả luôn được yêu thích và được biết đến như một “nơi” an trú yên bình cho bạn đọc.</div>
                        </div>
                        <div className="mt-5">
                            <span className="fw-bold">Lam – Một chiếc ôm nhỏ bé đang vượt qua vạn nghìn câu chữ chỉ để ôm bạn vào lòng.e</span>
                            <div >Nếu mỗi người trên cuộc đời này được sinh ra với một sứ mệnh riêng biệt, thì sứ mệnh của Lam chính là “chữa lành” bạn qua ngôn từ gần gũi và góc nhìn đời rất “thơ”.</div>
                        </div>
                    </div>
                </div>
                <div className="col-4 text-center mt-2 !important">
                    <span ><span className="fw-bold"></span> giám đốc - CEO</span>
                </div>
            </div>
            <div className="container-fuild mt-5">
                <img style={{width: '100%'}} src="http://skybooks.vn/wp-content/uploads/2015/12/Untitled-1-2.jpg" alt="" />
            </div>
            <div className="container  mt-5">
                <div className="text-center mt-5 pb-5">
                    <span className="fs-3 fw-bold ">Why <span style={{ color: '#f07c29' }}>Choose</span> Us</span>
                </div>
                <div className="d-flex">
                    <div className="col-3 me-5">
                        <img src="https://skybook.woovina.net/demo-01/wp-content/uploads/2020/05/about-us-banner2.jpg" alt="" style={{ maxWidth: '100%' }} />
                    </div>
                    <div className="col-9 ps-5">
                        <div >
                           
                            <p>Gửi tặng tất cả những thành viên của Skybooks, độc giả và dù bạn là ai, vô tình đọc được post này, xin trân trọng dành cho bạn vô vàn yêu thương.

8 năm, không phải là quá dài, nhưng cũng là một khoảng thời gian đủ dài để Skybooks trở thành một dấu ấn không thể quên đối với rất nhiều người. Từ những thành viên đầu tiên, tới những độc giả dù thân quen hay mới mẻ, tất cả đều là những mảnh ghép không thể thiếu để tạo nên Skybooks ngày hôm nay, với sứ mệnh đem đến cho thế hệ trẻ hiện đại những tri thức và cả những sự giải trí rất văn minh.

8 năm, là hành trình của rất nhiều sự nỗ lực của những người đặt nền móng đầu tiên tới những người vẫn còn ở lại đồng hành cho tới tận bây giờ. Tuy rằng, có rất nhiều lúc, nước mắt đã rơi, mồ hôi mướt mát, nhưng họ vẫn luôn yêu thương và hướng về Skybooks với tất cả những tình cảm chân thành và dịu dàng nhất.

8 năm, một hành trình trao gửi yêu thương, vẫn tiếp diễn và còn rất nhiều bất ngờ cũng như khó khăn ở phía trước. Nhưng không vì vậy, mà Skybooks dừng bước hay mỏi mệt. Bởi vì độc giả vẫn ở đấy, luôn yêu thương và chờ đợi, nên Skybooks cũng sẽ luôn ở đây, sẵn sàng lắng nghe và luôn luôn thấu hiểu.

Cảm ơn vì 8 năm với biết bao thăng trầm và thay đổi. Dù bạn là bất cứ ai, Skybooks cũng luôn biết ơn và yêu thương bạn. Bởi vì bạn, là một phần tuyệt vời nhất của tất cả chúng tôi ❤

Từ Skybooks với rất nhiều yêu thương ❤</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default About
