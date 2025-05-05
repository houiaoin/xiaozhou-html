$(document).ready(function() {
    // 随机网名生成器
    function generateNickname() {
        const adjectives = [
            "沉思的", "恍惚的", "自洽的", "拧巴的", "薛定谔的", "不羁的", 
            "假装深沉的", "偶尔清醒的", "宇宙级的", "一本正经胡说八道的", 
            "存在主义的", "宿醉未醒的", "形而上学的", "有点懵的", "逻辑闭环的",
            "半梦半醒的", "貌似通透的", "间歇性思考的", "自我拉扯的", "乐观悲观随机切换的",
            "告白气球漏气的", "漠河舞厅不蹦迪的", "像疯一样的", "稻香田里摸鱼的", 
            "七里香过期了的", "需要人陪但社恐的", "我怀念的（昨天晚饭）",
            "让子弹飞一会儿的", "重庆森林迷路的", "无间道卧底（在摸鱼）", 
            "头号玩家（但卡关）", "这个杀手不太冷的（因为穿秋裤）", "阿甘快跑（去厕所）",
            "流浪地球推车的", "功夫熊猫学不会的",
            "主打一个陪伴的", "尊嘟假嘟分不清的", "主打的就是一个", "有点emo但能吃的", 
            "泰酷辣但怕冷的", "主打叛逆的", "栓Q了但没完全Q的", "退退退但没用的",
            "持续懵圈的", "格局打开又合上的", "CPU被烧干的", "反内卷失败的",
            "社交能量耗尽的", "购物欲望强烈的", "选择困难晚期的", "拖延到最后一秒的",
            "假装努力的", "间歇性踌躇满志的", "持续性混吃等死的", "熬夜赶DDL的",
            "沉迷学习无法自拔的（假的）", "对线自带复活甲的", "立flag专业户的",
            "只回哈哈哈的", "日常水逆的", "被甲方PUA麻木的", "沉迷吸猫的",
            "起床困难户的", "热衷于考古自己发言的", "转发锦鲤但佛系的",
            "口头减肥的", "热衷于囤货的", "知识付费但没学的", "在挨骂边缘试探的"
        ];
        
        const nouns = [
            "咸鱼", "思想泡泡", "键盘侠", "拖延症患者", "悖论本身", "白日梦想家", 
            "时间旅行者（新手）", "哲学土豆", "段子手", "路过的芝士", "吃瓜群众", 
            "迷路的灵魂", "人形弹幕", "理论巨人（行动矮子）", "生活观察员", 
            "甲方乙方混合体", "意义追寻机", "快乐源泉（待续费）", "bug制造者", "无用知识收藏家",
            "显眼包", "电子宠物", "气氛组", "摆烂王", "乐子人", "打工人", 
            "干饭魂", "摸鱼大师", "废话文学家", "互联网嘴替", "赛博活佛",
            "时间刺客（指DDL）", "搞笑男/女（待认证）", "精神股东", "理论派掌门",
            "人间清醒（装的）", "快乐小狗（需充电）", "野生代言人", "退堂鼓表演艺术家",
            "赖床锦标赛冠军", "一级抬杠运动员", "熬夜协会荣誉会长",
            "社恐患者", "吃土少年/少女", "天秤座本座（代指选择困难）", "DDL杀手",
            "演技派", "梦想家（待实现）", "咸鱼本鱼", "工具人", "搬砖工",
            "学渣代言人", "复读机", "人形种草机", "表情包大户", "反思怪",
            "气氛终结者", "资深潜水员", "沙发冲浪选手", "云养宠专家",
            "起床协会常务理事", "考古学家（社交平台限定）", "锦鲤绝缘体",
            "美食评论家（仅限口头）", "仓鼠症晚期", "知识收藏家（仅收藏）", "作死小能手"
        ];
        
        const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        
        return `${randomAdj}${randomNoun}`;
    }
    
    // 格式化日期时间
    function formatDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    
    // 加载所有留言
    function loadMessages() {
        $.ajax({
            url: '/api/messages',
            type: 'GET',
            dataType: 'json',
            success: function(messages) {
                if (messages.length === 0) {
                    $('#messagesList').html('<p class="text-center text-muted">暂无留言，来说点什么吧！</p>');
                    return;
                }
                
                const messagesHtml = messages.map(message => `
                    <div class="message-item" data-id="${message.id}">
                        <div class="message-header">
                            <span class="message-author">${message.author}</span>
                            <span class="message-time">${message.time}</span>
                        </div>
                        <div class="message-content">
                            ${message.content}
                        </div>
                    </div>
                `).join('');
                
                $('#messagesList').html(messagesHtml);
            },
            error: function(xhr, status, error) {
                console.error('获取留言失败:', error);
                $('#messagesList').html('<p class="text-center text-danger">获取留言失败，请刷新页面重试</p>');
            }
        });
    }
    
    // 提交留言
    $('#messageForm').on('submit', function(e) {
        e.preventDefault();
        
        const messageContent = $('#messageContent').val().trim();
        
        if (messageContent) {
            // 生成随机网名和时间
            const nickname = generateNickname();
            const dateTime = formatDateTime();
            
            // 准备要发送的数据
            const messageData = {
                author: nickname,
                content: messageContent,
                time: dateTime
            };
            
            // 提交按钮禁用并显示加载状态
            const $submitBtn = $(this).find('button[type="submit"]');
            const originalBtnText = $submitBtn.text();
            $submitBtn.prop('disabled', true).text('发送中...');
            
            // 发送留言到服务器
            $.ajax({
                url: '/api/messages',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(messageData),
                success: function(response) {
                    // 创建新留言HTML
                    const newMessage = `
                        <div class="message-item" data-id="${response.id}">
                            <div class="message-header">
                                <span class="message-author">${nickname}</span>
                                <span class="message-time">${dateTime}</span>
                            </div>
                            <div class="message-content">
                                ${messageContent}
                            </div>
                        </div>
                    `;
                    
                    // 检查是否为第一条留言
                    if ($('#messagesList').find('.text-muted').length) {
                        $('#messagesList').empty();
                    }
                    
                    // 将新留言添加到留言列表顶部
                    $('#messagesList').prepend(newMessage);
                    
                    // 清空留言框
                    $('#messageContent').val('');
                    
                    // 显示成功提示
                    showAlert('留言成功！', 'success');
                },
                error: function(xhr, status, error) {
                    console.error('提交留言失败:', error);
                    showAlert('留言提交失败，请重试', 'danger');
                },
                complete: function() {
                    // 恢复提交按钮状态
                    $submitBtn.prop('disabled', false).text(originalBtnText);
                }
            });
        } else {
            showAlert('请输入留言内容', 'warning');
        }
    });
    
    // 显示提示信息
    function showAlert(message, type) {
        // 先移除已有的提示
        $('.message-alert').remove();
        
        const alertHtml = `
            <div class="alert alert-${type} message-alert alert-dismissible fade in" role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                ${message}
            </div>
        `;
        
        // 添加提示到表单上方
        $('#messageForm').before(alertHtml);
        
        // 3秒后自动关闭
        setTimeout(function() {
            $('.message-alert').alert('close');
        }, 3000);
    }
    
    // 初始加载留言
    loadMessages();
});
