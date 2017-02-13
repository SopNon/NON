function getCookie(cookieName){
	var str=document.cookie;
	var i=-1;
	if((i=str.indexOf(cookieName+"="))!=-1){
		var start=i+cookieName.length+1;
		var end=str.indexOf(";",start);
		return str.slice(start,end==-1?str.length:end);
	}else{return null;}
}

function setCookie(cookieName,value){
	var date=new Date();
	date.setFullYear(date.getFullYear()+1);
	document.cookie=cookieName+"="+value+";expires="+date.toGMTString();
}

var game={
	data:null,//保存一个二维数组
	RN:4,//总行数
	CN:4,//总列数
	score:0,//游戏得分
	state:1,//游戏状态：1是运行,0是结束
	RUNNING:1,//运行中
	GAMEOVER:0,//结束
	PLAYING:2,//动画播放中
	top:0,//游戏的最高分
	CSIZE:100,//每个格子的宽和高
	OFFSET:16,//格子的间距和边距
	
	init:function(){//按照RNxCN的个数生成背景格和前景格
		//设置id为gridPanel的宽为width
		//设置id为gridPanel的高为height
		//r从0开始，到<RN结束，每次增1，同时声明空数组arr
			//	c从0开始，到<CN结束，每次增1
				//向arr中压入""+r+c
		//遍历结束
		/*
		设置gridPanel的内容为：'<div id="g'+arr.join('" class="grid"></div><div id="g')+'" class="grid"></div>'
		为gridPanel的内容拼接上：'<div id="c'+arr.join('" class="cell"></div><div id="c')+'" class="cell"></div>'
		*/
		var width=this.CN*(this.CSIZE+this.OFFSET)+this.OFFSET;
		var height=this.RN*(this.CSIZE+this.OFFSET)+this.OFFSET;
		gridPanel.style.width=width+"px";
		gridPanel.style.height=height+"px";
		for(var r=0,arr=[];r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				arr.push(""+r+c);
			}
		}
		gridPanel.innerHTML='<div id="g'+arr.join('" class="grid"></div><div id="g')+'" class="grid"></div>';
		gridPanel.innerHTML+='<div id="c'+arr.join('" class="cell"></div><div id="c')+'" class="cell"></div>';
    },

	//强调：对象自己的方法要使用自己的属性，必须加this
	start:function(){//启动游戏
		//初始化二维数组
		//r从0开始，到<RN结束，每次增加1
			//向date中压入一个空数组
			//c从0开始，到<CN结束，每次增加1
				//在data中r行c列的位置保存一个0
		//（遍历结束）
		//调用randomNum方法
		//再调用randomNum方法
		this.init();//生成界面
		this.top=getCookie("top")||0;
		this.state=this.RUNNING;//初始化游戏状态为游戏中
		this.score=0;
		this.data=[];
		for(var r=0;r<this.RN;r++){
			this.data.push([]);//this.data[r]=[];
			for(var c=0;c<this.CN;c++){
				this.data[r][c]=0;
			}
		}
		this.randomNum();//调用randomNum方法
		this.randomNum();//再调用randomNum方法
		this.updateView();//更新页面
		var me=this;//留住this
		//为当前页面绑定键盘事件
		document.onkeydown=function(e){//事件对象
			if(me.state==me.RUNNING){
				switch(e.keyCode){
					case 37:me.moveLeft();break;
					case 38:me.moveUp();break;
					case 39:me.moveRight();break;
					case 40:me.moveDown();break;
				}
			}
		}//document.onkeydown();//this->document
	},//强调：每个方法之间必须用逗号分隔

	isGameOver:function(){//判断游戏是否结束
		//遍历data中每个元素
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				if(this.data[r][c]==0){//如果当前元素等于0
					return false;//返回false
				}
				//如果c<CN-1而且当前元素等于右侧元素
				if(c<this.CN-1&&this.data[r][c]==this.data[r][c+1]){
					return false;//返回false
				}
				//如果r<RN-1而且当前元素等于下方元素
				if(r<this.RN-1&&this.data[r][c]==this.data[r+1][c]){
					return false;//返回false
				}
			}
		}//(遍历结束)返回true
		return true;
	},
	
	move:function(fun){//定义所有移动中相同的代码
		var before=String(this.data);//为data拍照，保存在before中
		fun.call(this);
		var after=String(this.data);//为data拍照，保存在after中
		if(before!=after){ //如果before不等于after，就随机生成数，更新页面
			this.state=this.PLAYING;
			animation.startMove(function(){
				this.randomNum();
				//如果调用isGameOver返回true
				if(this.isGameOver()){
					this.state=this.GAMEOVER;//修改游戏状态为GAMEOVER
					//如果score>top,设置cookie中的top变量score
					this.score>this.top&&setCookie("top",this.score);
				}else{
					this.state=this.RUNNING;
				}
				this.updateView();
			}.bind(this));
		}
	},

/*	moveDown:function(){//下移所有列
		//为data拍照，保存在before中
		//遍历data中每一列
			//调用moveUpInCol，传入c作为参数
		//(遍历结束)
		//为data拍照，保存在after中
		//如果before不等于after，就随机生成数，更新页面
		//如果调用isGameOver返回true
        //修改游戏状态为GAMEOVER
		var before=String(this.data);
		for(var c=0;c<this.CN;c++){
			this.moveDownInCol(c);
		}
		var after=String(this.data);
		before!=after&&(this.randomNum(),this.updateView());
	},
*/
	
	moveDown:function(){//下移所有列
		this.move(function(){
			for(var c=0;c<this.CN;c++){//遍历data中每一列
				//调用moveUpInCol，传入c作为参数
				this.moveDownInCol(c);
			}//(遍历结束)
		});    
	},

	moveDownInCol:function(c){
		for(var r=this.RN-1;r>0;r--){
			var prevr=this.getPrevInCol(r,c);
			if(prevr==-1){break;}
			else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[prevr][c];
					//将nextc移动到c位置
					animation.addTask(prevr,c,r,c);
					this.data[prevr][c]=0;
					r++;
				}else if(this.data[r][c]==this.data[prevr][c]){
					this.data[r][c]*=2;
					this.score+=this.data[r][c];
					//将nextc移动到c位置
					animation.addTask(prevr,c,r,c);
					this.data[prevr][c]=0;
				}
			}
		}
	},
	
	getPrevInCol:function(r,c){
		for(var prevr=r-1;prevr>=0;prevr--){
			if(this.data[prevr][c]!=0){return prevr;}
		}
		return -1;
	},

	moveUp:function(){//上移所有列
		this.move(function(){
			for(var c=0;c<this.CN;c++){//遍历data中每一列
				//调用moveUpInCol，传入c作为参数
				this.moveUpInCol(c);
			}//(遍历结束)
		});
	},

	moveUpInCol:function(c){
		/*从上到下遍历每一行
		调用getNextInCol，传入r、c作为参数，返回值保存在nextr中
		如果nextr等于-1，就退出循环
		否则
			如果r行c列等于0
				将nextr行c列赋值给r行c列
				将nextr行位置为0
				r--
			否则如果r行c列等于nextr行c列
			将r行c列乘2
			强nextr行c列位置为0
		*/
		for(var r=0;r<this.RN-1;r++){
			var nextr=this.getNextInCol(r,c);
			if(nextr==-1){
				break;
			}else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[nextr][c];
					//将nextc移动到c位置
					animation.addTask(nextr,c,r,c);
					this.data[nextr][c]=0;
					r--;
				}else if(this.data[r][c]==this.data[nextr][c]){
					this.data[r][c]*=2;
					animation.addTask(nextr,c,r,c);
					this.score+=this.data[r][c];
					this.data[nextr][c]=0;
				}
			}
		}
	},
	
	getNextInCol:function(r,c){
		/*nextr从r+1开始，到<RN结束，每次增1
			如果nextr行c列不等于0，就返回nextr
		遍历结束就返回-1
		
		*/
		for(var nextr=r+1;nextr<this.RN;nextr++){
			if(this.data[nextr][c]!=0){return nextr}
		}
		return -1;
	},

	moveRight:function(){/*右移所有行
		为data拍照，保存在before中
		遍历data中每一行
			调用moveRightInRow，传入r作为参数
		遍历结束
		为data拍照，保存在after中
		如果before不等于after
			随机生成数
			更新页面
		*/
		this.move(function(){
			for(var r=0;r<this.RN;r++){//遍历data中每一行
				//调用moveRightInRow，传入r作为参数
				this.moveRightInRow(r);
			}//(遍历结束)
		});
	},

	moveRightInRow:function(r){
		/*从右向左遍历r行中每个元素，到>0结束
			调用getPrevInRow，传入r、c作为参数，返回值保存在prevc中
			如果prevc为-1，就退出循环
			否则
				如果data中r行c位置等于0
					将data中r行prevc位置的值赋给data中r行c位置
					将data中r行prevc位置为0
					c++
				否则 如果data中r行c位置等于data中r行prevc位置
					data中r行c位置乘2保存在data中r行c列
					data中r行prevc位置为0
			*/
		for(var c=this.CN-1;c>0;c--){
			var prevc=this.getPrevInRow(r,c);
			if(prevc==-1){break;}
			else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[r][prevc];
					animation.addTask(r,prevc,r,c);
					this.data[r][prevc]=0;
					c++;
				}else if(this.data[r][c]==this.data[r][prevc]){
					this.data[r][c]*=2;
					animation.addTask(r,prevc,r,c);
					this.score+=this.data[r][c];
					this.data[r][prevc]=0;
				}
			}
		}
	},
	
	getPrevInRow:function(r,c){
		for(var prevc=c-1;prevc>=0;prevc--){
			if(this.data[r][prevc]!=0){return prevc}
		}
		return -1;
	},

	moveLeft:function(){//左移所有行
		//移动前为数组拍照(String(this.data))保存在变量before中
		//r从0开始到<RN结束，r++
			//调用moveLeftInRow(r)左移第r行
		//遍历结束
		//移动后为数组拍照(String(this.data))保存在变量after中
		//如果before不等于after
			//调用randomNun随机生成一个数
			//调用updateView更新页面
		this.move(function(){
			for(var r=0;r<this.RN;r++){
				//调用moveLeftInRow(r)左移第r行
				this.moveLeftInRow(r);
			}//(遍历结束)
		});
	},
	
	moveLeftInRow:function(r){//左移r行
		//c从0开始到<CN-1结束，每次增1
			//查找c位置后下一个不为0的位置保存在nextc中
			//var nextc=this.getNextInRow(r,c);
			//如果nextc是-1，就退出循环
			//否则
				//如果data中r行c位置等于0
					//将data中r行nextc位置的值赋值给data中r行c位置
					//将data中r行nextc位置置为0
					//c--;//下次还在当前位置开始
				//否则 如果data中r行c位置等于data中r行nextc位置
					//将data中r行c位置*2
					//将data中r行nextc位置置为0
		for(var c=0;c<this.CN-1;c++){
			var nextc=this.getNextInRow(r,c);
			if(nextc==-1){break;}
			else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[r][nextc];
					animation.addTask(r,nextc,r,c);
					this.data[r][nextc]=0;
					c--;
				}else if(this.data[r][c]==this.data[r][nextc]){
					this.data[r][c]*=2;
					//将nextc移动到c位置
					animation.addTask(r,nextc,r,c);
					this.score+=this.data[r][c];//累加得分
					this.data[r][nextc]=0;
				}
			}
		}
	},
	
	getNextInRow:function(r,c){//查找r行c列右侧下一个不为0的位置
		//nextc从c+1开始，到<CN结束,nextc每次增1
			//如果data中r行nextc位置的值!=0
				//返回nextc
		//(遍历结束)就返回-1
		for(var nextc=c+1;nextc<this.CN;nextc++){
			if(this.data[r][nextc]!=0){return nextc}
		}
		return -1;
	},

	updateView:function(){//将data中的元素更新到页面的各自div中
		//r从0开始，到RN结束，每次增加1
			//c从0开始，到CN结束，每次增加1
				//查找id为c+r+c的div元素，保存在变量div中
				//var div=document.getElementById("c"+r+c);
				//如果data中r行c列的等于0
					//设置div的内容""空字符串
					//设置div的className为"cell"
				//否则
					//设置div的内容为data中r行c列的值
					//设置div的className为"cell n"+data中r行c列的值
		topScore.innerHTML=this.top;//设置topScore的内容为top属性
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				var div=document.getElementById("c"+r+c);
				this.data[r][c]==0?(div.innerHTML="",div.className="cell"):(div.innerHTML=this.data[r][c],div.className="cell n"+this.data[r][c]);
			}
		}
		//找到id为score的span，直接设置其内容为score属性值
		score.innerHTML=this.score;
		//设置id为gameOver的元素的display属性为:
			//如果state为GAMEOVER，就设置为"block",否则为"none"
		this.state==this.GAMEOVER&&(final.innerHTML=this.score);
		gameOver.style.display=this.state==this.GAMEOVER?"block":"none";
	},

	randomNum:function(){//在随机位置生成一个数字
		//反复生成数字
			//在0~RN-1之间生成一个随机的行号保存在r中
			//在0~CN-1之间生成一个随机的列号保存在c中
			//如果data中r行c列为0
				//随机生成一个数字保存在num中，
				//设置data中r行c列的元素值为num：如果num<0.5,就设置2，否则就设置4
					//退出循环
		for(;;){
			var r=Math.floor(Math.random()*this.RN);//parseInt(Math.random()*this.RN);
			var c=parseInt(Math.random()*this.CN);
			if(this.data[r][c]==0){
				var num=Math.random();
				this.data[r][c]=num<0.5?2:4;
				break;
			}
		}
	}
}
//当页面加载后，自动启动
window.onload=function(){
	game.start();
}