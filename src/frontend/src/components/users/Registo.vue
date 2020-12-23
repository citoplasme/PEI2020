<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary" height="200px">
            <v-toolbar-title>
              <v-img contain :src="require('../../assets/logo_full.png')" />
              <br />
              Register
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-text-field
                prepend-icon="person"
                name="name"
                v-model="form.name"
                label="Name"
                type="text"
                :rules="regraNome"
                required
              />
              <v-text-field
                prepend-icon="email"
                name="email"
                v-model="form.email"
                label="Email"
                type="email"
                :rules="regraEmail"
                required
              />

              <v-text-field
                id="password"
                prepend-icon="lock"
                name="password"
                v-model="form.password"
                label="Password"
                type="password"
                :rules="regraPassword"
                @input="verificaPassword()"
                required
              />
              <v-text-field
                id="rep_password"
                prepend-icon="lock"
                name="rep_password"
                v-model="form.rep_password"
                label="Repeat the Password"
                type="password"
                :rules="regraPassword"
                @input="verificaPassword()"
                required
              />
              <v-flex>
                <v-select
                  :items="['Client', 'Service Provider']"
                  :rules="regraTipo"
                  prepend-icon="assignment"
                  v-model="form.type"
                  label="User Type"
                  required
                >
                </v-select>
              </v-flex>
              <v-flex>
                <v-checkbox v-model="checkbox" :rules="regraToS">
                  <template v-slot:label>
                    <div>
                      I agree with the
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <b @click="tos_modal = true" @click.stop v-on="on">
                            Terms of Service
                          </b>
                        </template>
                        See Terms of Service
                      </v-tooltip>
                      .
                    </div>
                  </template>
                </v-checkbox>
              </v-flex>
              <v-flex>
                <v-checkbox v-model="checkbox2" :rules="regraAge">
                  <template v-slot:label>
                    <div>
                      I am over 18 years old.
                    </div>
                  </template>
                </v-checkbox>
              </v-flex>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="error" type="submit" @click="cancelar">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit" @click="registarUtilizador"
              >Register</v-btn
            >
          </v-card-actions>
          <v-snackbar
            v-model="snackbar"
            :color="color"
            :timeout="timeout"
            :top="true"
          >
            {{ text }}
            <v-btn text @click="fecharSnackbar">Close</v-btn>
          </v-snackbar>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog :value="tos_modal" persistent>
      <v-card>
        <v-card-title class="headline">Terms of Service</v-card-title>
        <v-card-text style="text-align: justify; text-justify: inter-word;">
          <b>Terms of Use Notice:</b> This Agreement on Terms of Use, which
          includes, in particular, the terms and conditions and privacy policy
          of this website, constitutes a contract between Servicify and those
          who enjoy the platform, so it should be read carefully.<br />
          The use of the services provided by this website implies the
          acceptance of its Terms of Use, including its privacy policy and
          therefore, in case of disagreement with some of its provisions, the
          use of the service is not allowed.<br />
          The last amendment to these Terms of Use dates from 22.12.2020.<br /><br />
          <b>Table of Contents:</b><br />
          <ol>
            <li>Definitions and General Conditions</li>
            <li>Privacy Policy</li>
            <li>Guarantees</li>
            <li>Rights and Obligations</li>
            <li>Responsibility</li>
            <li>Conflicts</li>
            <li>Penalties</li>
            <li>Payments</li>
            <li>Transitional and Final Provisions</li>
          </ol>
          <b>1. Definitions and General Conditions</b><br /><br /><b
            >a) Definitions</b
          >
          <ul>
            <li>
              <b>"Servicify"</b> - website of the trademark "Servicify", owned
              by the company Servicify, Lda.
            </li>
            <li>
              <b>"Final Clients" </b>- those who use Servicify's website to
              place orders for the provision of certain services by
              professionals registered for that purpose.
            </li>
            <li>
              <b>"End Customer Information" </b>- any information provided by
              the End Customer, either during the phase of their registration
              and registration on the website, or in relation to the description
              of their requests, the evaluation made by professional service
              providers or other resulting from the use of the website.
            </li>
            <li>
              <b>"Privacy Policy"</b> - description of the types of information
              collected from End Users or Customers and the Service Provider and
              how it is handled.
            </li>
            <li>
              <b>"Request"</b> - description made by the Client of the service
              he wishes to see provided by a professional registered on the
              website, through a form for that purpose.
            </li>
            <li>
              <b>"System" </b>- computer equipment, storage and transmission of
              data, program and computer applications, sequences of commands and
              automatic processes of analysis and treatment of data that are
              used by Servicify.
            </li>
            <li>
              <b>"Terms and Conditions"</b> - are the rules that are binding on
              Servicify, Users, End Customers and Service Providers, contained
              in this Terms of Use Agreement and the terms of the Privacy
              Policy.
            </li>
            <li>
              <b>"Professional"</b> - natural or legal persons, service
              providers, registered in the Servicify website, who intend, by
              this way, to receive requests from potential End Clients
              interested in contracting those services.
            </li>
            <li>
              <b>"User"</b> - any natural or legal person who accesses the
              website until the moment they acquire the status of End Customer
              or Service Provider.
            </li>
            <li>
              <b>"Website" (of Servicify)</b> - website and its domain, hosting
              space, page or set of web pages, its contents, graphics of other
              information contained therein, whose content is managed by
              Servicify.
            </li>
          </ul>
          <b> b) General Conditions </b>
          <ol>
            <li>
              Servicify's website is an online platform where End-Customers
              request a certain service from Service Providers, who can then
              enter a biding process with the customer
            </li>
            <li>
              Requests submitted by End Clients are disclosed to registered
              Service Providers whose activity is compatible with them.
            </li>
            <li>
              It is up to the End Customer to evaluate the proposals and
              services presented by the Professionals, and the selection of the
              Professional is their entire and exclusive responsibility.
            </li>
            <li>
              Servicify is limited, in its intervention, to collecting the End
              Clients' requests and the registrations of the Professional
              service providers, disclosing those to them in order to allow the
              process of choosing the End Client.
            </li>
            <li>
              The End Customer may even choose not to select any of the
              Professionals who contact them for the presentation of their
              proposals, recognizing that Servicify is a third party in the
              relationship contractually established between End Customer and
              Professional. Therefore, Servicify does not guarantee the
              performance of the Professional or any transaction that may be
              agreed upon between them.
            </li>
            <li>
              The information regarding orders and Professionals that appears on
              the website is provided, respectively, by End Clients and
              Professionals.
            </li>
            <li>Servicify does not select specific Professionals;</li>
            <li>
              End Clients and Professionals are obliged to include only true and
              correct information on the website.
            </li>
            <li>
              is not responsible for the information referred to in the previous
              paragraph and the End Customer must, prior to the selection of the
              Professional, evaluate and prove the truthfulness, accuracy and
              integrity of the same.
            </li>
            <li>
              The presentation, by the Professional to the End Client, of
              fraudulent proposals or false or incorrect documents, in no case
              can be imputed to Servicify, and the End Client is responsible for
              the selection of the Professionals and the confirmation of the
              information provided by them.
            </li>
          </ol>
          <b>c) Privacy Policy</b> <br /><br />The company Servicify, Ltd, the
          entity responsible for the domain https://www.servicify.di.uminho.pt/,
          values the privacy of its visitors and in this sense is committed to
          respecting it, ensuring the confidentiality and protection of data
          recorded by users. <br /><br />This Privacy Statement is intended to
          ensure security and privacy conditions to users, being only requested
          and collected the data necessary to provide the service, according to
          the explicit indications on the site. The user has full freedom to
          access their data, rectify them or delete them.<br /><br />
          We assume the following commitments towards the Users:
          <ul>
            <li>
              To process data in a lawful and fair manner, collecting only the
              necessary information relevant to the purpose for which they are
              intended;
            </li>
            <li>
              To allow the holder of the data to access and correct the
              information about them registered;
            </li>
            <li>
              Not to use the data collected for a purpose incompatible with that
              of collection;
            </li>
            <li>To keep the data accurate and, if necessary, current;</li>
            <li>
              To guarantee free of charge the right to delete the data used when
              requested by the owner;
            </li>
            <li>
              To possess security mechanisms that prevent the consultation,
              modification, destruction or addition of the data by a person not
              authorized to do so;
            </li>
            <li>
              Not to interconnect personal data, unless authorized by law.
            </li>
          </ul>
          <b>d) Collection of Personal Data</b> <br /><br />The site
          https://www.servicify.di.uminho.pt/ can be viewed without any personal
          information being required. However, there are areas - such as placing
          a service request - that require the provision of information,
          requiring users to provide their personal data in order to take
          advantage of the services provided. <br /><br />The collection of user
          identification data will be carried out by filling out an online
          registration form and will occur in accordance with the strictest
          security rules.<br /><br />
          The user when registering at www.servicify.di.uminho.pt provides
          personal data, such as name, e-mail address, telephone number, e-mail,
          etc., necessary to subscribe to the services, the site's newsletters
          and the newsletters of associated partners.<br />
          When you interact with our Platform or use our Services, we
          automatically collect the following data:
          <ol>
            <li>
              <b>User Login Data</b> We store technical details such as your IP
              (Internet Protocol), location of your device, time zone and
              operating system. We also save your browser type and version and
              your Login information, namely registration date, date of last
              password change and date of last successful login.
            </li>
            <li>
              <b> Click Sequence Data</b> We collect information about your
              activity on Servicify that includes the sites from which you
              arrived at our platform, date and time of each visit, searches
              made on Servicify, list of advertisements or classifieds of
              Servicify that you clicked, your interaction with those
              advertisements or classifieds, the duration of your visit and the
              order in which you visited the content of the platform.
            </li>
            <li>
              <b> Cookies and Similar Technologies</b> "Cookies" are small text
              files transferred by a web server to the storage of your device.
              We use cookies to manage our users' sessions, store their language
              preferences and show you ads relevant to you. Cookies are used to
              collect the date and time of your visit, your search history, your
              preferences and your username. You can choose to block all or part
              of your browser from using cookies, or to alert you when websites
              wish to use cookies. If you disable or block cookies, remember
              that part of our service and platform may become inaccessible or
              not function properly. Data collected from third parties or
              publicly available sources:
            </li>
          </ol>
          We receive personal data about you from the following third parties
          (and public services):
          <ul>
            <li>
              Technical data providers and usability data analyzers: Google,
              Facebook, Optimizely and Hotjar;
            </li>
            <li>
              Navigation and conversion data from advertising providers: Google,
              Facebook
            </li>
          </ul>
          www.servicify.di.uminho.pt uses the services of Google Analytics for
          Display, namely the remarketing function. This consists of displaying
          ads to users who have already visited
          https://www.servicify.di.uminho.pt/.<br /><br />
          Users can opt out of Google Analytics for Display Advertisers and be
          exposed to Google Display Network ads when visiting Ads Preferences
          Manager and Analytics Opt-out Browser Add-on.<br /><br />
          www.servicify.di.uminho.pt uses remarketing to advertise online, which
          means that users who do not "opt-out" from the Google Display Network
          using the above methods may be exposed to ads from
          www.servicify.di.uminho.pt on the Google content network.
          <br /><br />Third parties such as Google may display ads from
          www.servicify.di.uminho.pt on sites within their content network.
          <br /><br />Third parties, such as Google, may use Cookies (such as
          Google Analytics and DoubleClick cookies) which serve to optimize ads
          based on information from past visits of users to
          www.servicify.di.uminho.pt.<br /><br />
          <b>e) User Registration</b> <br /><br />The user registration allows
          access to several services of www.servicify.di.uminho.pt. The
          subscription request requires the introduction of a password and an
          email address, to which a confirmation link is sent, which will allow
          validation of the registration made. This password guarantees the user
          exclusive access to the management of the services.<br /><br />The
          data provided by the users will only be used in the execution of the
          services selected by the user for which they were provided and for
          newsletters of associated partners, and will not be added to another
          list, made available to other entities or used to send unrelated
          information. <br /><br />
          Access to www.servicify.di.uminho.pt is conditioned by a password,
          which will be indicated by the user at the time of registration. In
          case the user forgets his password, he can recover it by indicating
          the e-mail address where the account was registered. For security
          reasons, the password must have more than 6 characters.
          <br /><br />Recommendation: A good password should include letters,
          numbers and special characters and should not be a common or easily
          detectable word. <br /><br />The password is personal and
          non-transferable. The user's use of it is his/her own
          responsibility.<br /><br />
          <b>f) Other Services</b><br /><br />
          Other services that may arise later and that require the introduction
          of personal data and/or their respective entities are covered by the
          privacy and security policy of Servicify, Lda referred to in this
          document. Security and Quality of Information <br /><br />It is our
          goal to guarantee the quality and integrity of the information
          provided by the users of www.servicify.di.uminho.pt. In this sense,
          the necessary measures have been implemented, both technologically and
          organizationally, in order to keep the information secure, accurate,
          updated and complete.<br /><br />
          To ensure maximum security in the areas of www.servicify.di.uminho.pt
          where the personal data of users are collected, their transmission is
          encrypted. Sharing personal information<br /><br />
          The personal information collected at
          https://www.servicify.di.uminho.pt/ is used for the purposes indicated
          in each case.<br /><br /><b>g) Links</b><br /><br />
          www.servicify.di.uminho.pt contains links to other websites, and the
          website is not responsible for the privacy policies or content of such
          websites.<br /><br /><b>h) Statistical Log</b><br /><br />
          Files The IP addresses of all connections made to
          www.servicify.di.uminho.pt are recorded. This information will be used
          to perform aggregate statistical analysis and no relationship will be
          established with the services and interactions with users.<br /><br />
          The information will be analysed in an aggregated and anonymous way.
          The data used for this purpose do not contain personal identification
          data or private information. <br /><br />The analyses carried out from
          the aggregated statistical information will be carried out in order to
          interpret the patterns of use of the site and continuously improve
          service levels and user satisfaction. Aggregated statistical
          information resulting from the analyses made may be disclosed to third
          parties or publicly.<br /><br />
          Should www.servicify.di.uminho.pt change its privacy practices, these
          will always be available at this site.<br /><br />
          For further information, please contact support-pt@Servicify.com.<br /><br />
          <b>Conditions of Use</b><br /><br />
          www.servicify.di.uminho.pt reserves the right to cancel the
          registration of any user who does not comply with the Terms and
          Conditions of Use. <br /><br />If you have any questions, complaints
          or comments regarding our privacy statement or policy, please contact
          us at support-pt@Servicify.com. <br /><br />
          <ol>
            <li>
              <b> Warranties</b>
              <ol>
                <li>
                  Servicify guarantees the continuous and correct functioning of
                  its website, except in situations where, for reasons beyond
                  its control, such compliance cannot be demanded.
                </li>
                <li>
                  Without prejudice to the above, Servicify reserves the right,
                  as owner of the website, to suspend or cause its operation to
                  cease whenever it understands that justified reasons (related
                  either to third parties or to its business model) justify it,
                  which in any case will be communicated as soon as possible to
                  its users.
                </li>
                <li>
                  Final and Professional Clients are obliged, in the inclusion
                  of information, to take into account the compliance with the
                  legislation in force, namely regarding competition, protection
                  of consumer rights, misleading advertising and discrimination.
                  Information of an obscene nature or with indecent content,
                  infringing on good customs or pornographic content is also
                  forbidden, as are references to other sites, of whatever
                  nature.
                </li>
                <li>
                  Final Clients and Professionals undertake to ensure that none
                  of the information made available to Servicify contains
                  computer viruses, macro viruses, Trojan horses, worms or
                  anything that causes interference or can interrupt or in any
                  way disrupt the operating procedures of a computer.
                </li>
                <li>
                  Final and Professional Clients are also prevented from
                  accessing the system without express authorization, as well as
                  from clandestinely intercepting or intercepting data or
                  information of any nature, including personal data.
                </li>
                <li>
                  Servicify is not responsible for any error, omission,
                  inaccuracy or falsity of information transmitted by Final
                  Clients and Professionals.
                </li>
                <li>
                  Servicify reserves the right not to use, in any way, any
                  information that violates this Terms of Use Agreement.
                </li>
              </ol>
            </li>
            <li>
              <b> Rights and Obligations</b>
              <ol>
                <li>
                  Adherence as an End Customer or Professional to the Terms of
                  Use Agreement constitutes the conclusion of a contract between
                  them and Servicify, resulting in rights and obligations for
                  each of the parties, namely:
                </li>
                <li>
                  The End Customer is entitled to use the Web Site in accordance
                  with the terms and conditions set forth in this Terms of Use
                  Agreement with respect to the corresponding privacy policy.
                </li>
                <li>
                  Servicify has the obligation to collect orders from End
                  Clients and other information concerning them and communicate
                  them to the registered Professionals who provide corresponding
                  services with those desired by End Clients.
                </li>
                <li>
                  The End Clients are obliged not to submit orders not admitted
                  by law or by the terms of this Terms of Use Agreement.
                </li>
                <li>
                  Final Clients are solely responsible for the content and
                  accuracy of any information provided.
                </li>
                <li>
                  Final Clients and Professionals undertake not to copy,
                  reproduce, modify or in any way use any content of the
                  website, as well as not to use works and requests of which
                  they have become aware by this means for purposes other than
                  the contract negotiated and/or concluded through the contacts
                  provided by the website. Additionally, Final Clients and
                  Professionals are obliged not to send to third parties or in
                  any other way divulge requests contained in the website,
                  distribute or publicly display any content of the website
                  without prior express authorization from Servicify.
                </li>
                <li>
                  Final Clients and Professionals agree not to use the Servicify
                  website, its contents or services for any purpose other than
                  that for which it is intended, including for illicit, illegal
                  purposes or in any way capable of colliding with legally
                  protected rights of others.
                </li>
                <li>
                  Professionals are obliged to provide the services and perform
                  the work in accordance with the good practices of their
                  professional activities and to respect the deontological codes
                  and technical regulations that frame them.
                </li>
              </ol>
            </li>
            <li>
              <b>Responsibility</b>
              <ol>
                <li>
                  Servicify is not a party in any way to the contractual
                  relationship established between the End Customer and the
                  Professional, so the latter recognise that no liability can be
                  attributed to it, particularly with regard to the fulfilment
                  of the contract and the parties' contractual duties.
                </li>
                <li>
                  Likewise, Servicify may not be held liable for any breach of
                  contract by either party or non-contractually, and for any
                  loss or damage that may result for either party.
                </li>
              </ol>
            </li>
            <li>
              <b>Conflicts</b>
              <ol>
                <li>
                  Conflicts arising from the relationships established between
                  End Clients and Professionals must be reported to Servicify.
                </li>
                <li>
                  The information gathered as a result of the previous paragraph
                  is intended to allow Servicify to improve and update the
                  information regarding those registered on its website.
                </li>
              </ol>
            </li>
            <li>
              <b> Penalties</b>
              <ol>
                <li>
                  Servicify has the right to clarify and ascertain, on its own
                  initiative and whenever it deems necessary, the complaints of
                  which it has knowledge in order to evaluate and decide on the
                  permanence of Final Clients and Professionals in its website.
                </li>
                <li>
                  The use of the website may be suspended for a certain period
                  whenever it is shown that any of the obligations of the End
                  Clients and/or Professionals resulting from this Terms of Use
                  agreement have been violated.
                </li>
                <li>
                  End Clients and Professionals may be permanently prevented
                  from using the website whenever the violation of this Terms of
                  Use Agreement proves to have been sufficiently serious, either
                  in terms of the behaviour, the means used or the damage
                  caused.
                </li>
                <li>
                  Servicify reserves the right to suspend or terminate the
                  service provided by the use of its website to an End Customer
                  or Professional whenever there is suspicion that it is
                  violating or intends to violate the provisions of this Terms
                  of Use Agreement or applicable law.
                </li>
              </ol>
            </li>
            <li>
              <b>Payments</b>
              <ol>
                <li>
                  Use of the website by End Customers and Service Providers is
                  free of charge, the latter can activate 'Premium' in order to
                  have better visibility.
                </li>
              </ol>
            </li>
            <li>
              <b>Transitional and Final Provisions</b>
              <ol>
                <li>
                  In the event any or all of the clauses and provisions of this
                  Terms of Use Agreement are held to be invalid, the same shall
                  not be used but such invalidity shall not affect the validity
                  and enforceability of the remainder.
                </li>
                <li>
                  The implicit or explicit violation of any provision of this
                  Agreement by an End Customer or Professional shall result in
                  immediate termination of access to the Website.
                </li>
                <li>
                  This Terms of Use Agreement constitutes the entire agreement
                  between Servicify and the End Customers and Professionals,
                  replacing all other preceding documents, including
                  communications, exchanges of intent or other agreements
                  concerning the same content.
                </li>
                <li>
                  Any communication made in connection with or for the purpose
                  of the execution or fulfillment of this Agreement may be made
                  via email or simple mail to the contacts contained in the
                  website and information collected from users.
                </li>
                <li>
                  Any changes to this Terms of Use Agreement must be written and
                  brought to the attention of the counterparty, and acceptance
                  of the same shall be presumed if, upon becoming aware of them,
                  the use of the website is maintained.
                </li>
                <li>
                  Nothing contained in this Agreement constitutes or is likely
                  to be confused with the formation of any partnership, joint
                  venture, mandate, commission or other relationship other than
                  that arising from the contractual bond contained in the
                  adherence to this Agreement.
                </li>
              </ol>
            </li>
          </ol>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="tos_modal = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "signup",
  data() {
    return {
      regraNome: [v => !!v || "Name is required."],
      regraEmail: [
        v => !!v || "Email is required.",
        v => /^.+@.+\..+$/.test(v) || "Email has to be valid."
      ],
      regraPassword: [v => !!v || "Password is required."],
      regraTipo: [v => !!v || "Type is required."],
      regraToS: [v => !!v || "Acceptance of Terms of Service is required."],
      regraAge: [v => !!v || "Age confirnation is required."],
      form: {
        name: "",
        email: "",
        password: "",
        rep_password: "",
        type: ""
      },
      snackbar: false,
      color: "",
      done: false,
      timeout: 4000,
      text: "",
      tos_modal: false,
      checkbox: false,
      checkbox2: false
    };
  },

  methods: {
    verificaPassword() {
      if (this.form.password != this.form.rep_password) {
        if (this.regraPassword.length == 1) {
          this.regraPassword = this.regraPassword.concat([
            "The password must be the same."
          ]);
        }
      } else {
        if (this.regraPassword.length == 2) {
          this.regraPassword = this.regraPassword.slice(0, 1);
        }
      }
    },
    async registarUtilizador() {
      if (this.$refs.form.validate()) {
        var parsedType;
        switch (this.$data.form.type) {
          case "Client":
            parsedType = 1;
            break;
          case "Service Provider":
            parsedType = 3;
            break;
        }
        try {
          var response = await this.$request("post", "/users/registar", {
            name: this.$data.form.name,
            email: this.$data.form.email,
            password: this.$data.form.password,
            level: parsedType
          });

          this.$router.push("/");
        } catch (err) {
          this.text =
            "An error occurred during the register: " + err.response.data;
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        }
      } else {
        this.text = "Please fill every field.";
        this.color = "error";
        this.snackbar = true;
        this.done = false;
      }
    },
    fecharSnackbar() {
      this.snackbar = false;
      if (this.done == true) this.$router.push("/");
    },
    cancelar() {
      this.$router.push("/users/autenticacao");
    }
  }
};
</script>
