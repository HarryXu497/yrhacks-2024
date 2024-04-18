<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";
	
</script>

<Navbar search={true}/>

<section class="pageContainer">
	<!-- <div class="headline" style="margin-top: 80px">StudyLine</div> -->
	<div class="text">
		<img src="/fullblackSL.svg" class="headline">
		<img src="/Tagline.png" class="headline" style="position: relative; top: -65px">
	</div>
	<div></div>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style="position: absolute; bottom: 35px; left: 330px; transform: rotate(-12deg);">
		<path fill="#ffbe0b" fill-opacity="1" d="M0,160L40,144C80,128,160,96,240,101.3C320,107,400,149,480,165.3C560,181,640,171,720,144C800,117,880,75,960,69.3C1040,64,1120,96,1200,117.3C1280,139,1360,149,1400,154.7L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
	</svg>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style="position: absolute; bottom:3px;">
		<path fill="#43bccd" fill-opacity="1" d="M0,160L48,149.3C96,139,192,117,288,106.7C384,96,480,96,576,106.7C672,117,768,139,864,165.3C960,192,1056,224,1152,202.7C1248,181,1344,107,1392,69.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
	</svg>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style="position: absolute; bottom: -88px;">
		<path fill="#ed1170" fill-opacity="1" d="M0,256L48,240C96,224,192,192,288,160C384,128,480,96,576,69.3C672,43,768,21,864,10.7C960,0,1056,0,1152,32C1248,64,1344,128,1392,160L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
	</svg>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 319" style="position: absolute; bottom: 0;">
		<path fill="#273036" fill-opacity="1" d="M0,96L60,96C120,96,240,96,360,128C480,160,600,224,720,229.3C840,235,960,181,1080,138.7C1200,96,1320,64,1380,48L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
	</svg>
</section>

<section class="purpose">
	<div class="content">
		<h2>Our Goal</h2>
		<p>
			Studying alone is boring, and making friends is fun. That’s why we created StudyLine, an online platform that facilitates group study sessions for high school students. StudyLine supports live video and chat sessions, LaTeX, and real-time searching for study rooms.
		</p>
	</div>
</section>

<style lang="scss">
.text {
	margin-top: 2rem;
	display: flex;
	flex-direction: column;
}

.headline {
	font-weight: 900;
	font-size: 60px;
	line-height: 1.15;
	margin-left: 90px;
	width: 36rem;
	margin-top: 1.7rem;
}

.pageContainer {
	width: 100%;
	height: calc(100vh - 7rem);
	overflow: hidden;
    /* height: 400px;
    min-height: 400px; */
    position: relative;
}

.purpose {
	background-color: #273036;
	min-height: 30rem;

	display: flex;
	flex-direction: column;
	align-items: center;
}

.content {
	margin-top: 5rem;
	width: clamp(30rem, 40%, 56rem);
	color: white;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2rem;

	h2 {
		font-family: "Poppins", sans-serif;

		font-size: 3rem;
		font-weight: bold;
		text-align: center;
	}

	p {
		text-align: center;
		font-size: 1.25rem;
		line-height: 1.25;
	}
}
</style>