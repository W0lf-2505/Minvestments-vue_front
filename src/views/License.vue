<template>
    <div py-4 class="container-fluid">

        <div class="row">

            <div class="col-lg-7 position-relative z-index-2">
                <div class="mb-4 card card-plain">
                    <div class="p-3 card-body">
                        <h2>MInvestments Platform Proprietary License</h2>
                        <br><br>

                        <p>This license agreement ("Agreement") is a legal agreement between you (either an individual or an entity) and Motghare Investments Pvt Ltd. ("Licensor") for the use of  - <a href="#">MInvestments Platform</a> ("the Software"). By accessing or using the Software, you agree to be bound by the terms of this Agreement. If you do not agree to the terms of this Agreement, do not use the Software.</p>

                        <h3>License Grant:</h3>
                        <ul>
                            <li>Licensor grants you a non-exclusive, non-transferable license to use the Software for your personal or internal business purposes.</li>
                        </ul>

                        <h3>Restrictions:</h3>
                        <ul>
                            <li>You may not sublicense, sell, rent, lease, or otherwise transfer the Software or any rights granted under this Agreement to any third party.</li>
                            <li>You may not modify, adapt, translate, reverse engineer, decompile, or disassemble the Software, nor create derivative works based on the Software.</li>
                        </ul>

                        <h3>Ownership:</h3>
                        <p>The Software is licensed, not sold. Licensor retains all right, title, and interest in and to the Software, including all intellectual property rights.</p>

                        <h3>Termination:</h3>
                        <p>This Agreement is effective until terminated. Your rights under this Agreement will terminate automatically without notice from Licensor if you fail to comply with any term(s) of this Agreement. Upon termination of this Agreement, you shall cease all use of the Software and destroy all copies, full or partial, of the Software.</p>

                        <h3>Disclaimer of Warranty:</h3>
                        <p>The Software is provided "as is" without warranty of any kind, express or implied, including, but not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement. Licensor does not warrant that the Software will be error-free or that defects in the Software will be corrected.</p>

                        <h3>Limitation of Liability:</h3>
                        <p>In no event shall Licensor be liable for any special, incidental, indirect, or consequential damages whatsoever (including, without limitation, damages for loss of profits, business interruption, loss of information, or any other pecuniary loss) arising out of the use of or inability to use the Software, even if Licensor has been advised of the possibility of such damages.</p>

                        <h3>Governing Law:</h3>
                        <p>This Agreement shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.</p>

                        <p>By using the Software, you agree to abide by the terms and conditions of this Agreement.</p>

                    </div>
                </div>
            </div>

        </div>
        <div class="row">
        <div class="col-12">
          <!-- globe -->
          <globe width="700" height="600" />
        </div>
      </div>
    </div>
</template>

<script>
import Globe from "@/components/Globe.vue";

export default {
    name: "License",
    components: {
      Globe
    },
}
</script>
