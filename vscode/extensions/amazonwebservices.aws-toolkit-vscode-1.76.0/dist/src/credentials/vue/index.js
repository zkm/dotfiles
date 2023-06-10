(()=>{var de={459:(e,r,n)=>{"use strict";n.r(r),n.d(r,{default:()=>p});var s=n(537),o=n.n(s),a=n(645),_=n.n(a),c=_()(o());c.push([e.id,`
.pass-icon {
    color: #73c991;
    margin-right: 5px;
}
`,"",{version:3,sources:["webpack://./src/credentials/vue/authForms/formTitle.vue"],names:[],mappings:";AA4BA;IACI,cAAc;IACd,iBAAiB;AACrB",sourcesContent:[`<!-- 
    This is a re-usable component for creating a dynamic title
    that changes depending on if the auth method is already connected.
 -->

<template>
    <div v-if="isConnected" style="display: flex">
        <div class="pass-icon icon icon-lg icon-vscode-pass-filled"></div>
        <label class="auth-form-title">Connected to <slot></slot></label>
    </div>
    <div v-else>
        <label class="auth-form-title"><slot></slot></label>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        isConnected: {
            type: Boolean,
            required: true,
        },
    },
})
<\/script>

<style>
.pass-icon {
    color: #73c991;
    margin-right: 5px;
}
</style>
`],sourceRoot:""}]);const p=c},911:(e,r,n)=>{"use strict";n.r(r),n.d(r,{default:()=>y});var s=n(537),o=n.n(s),a=n(645),_=n.n(a),c=n(327),p=n(590),l=_()(o());l.i(c.Z),l.i(p.Z),l.push([e.id,`
#builder-id-form {
    width: 250px;
    height: fit-content;
}
`,"",{version:3,sources:["webpack://./src/credentials/vue/authForms/manageBuilderId.vue"],names:[],mappings:";AA4JA;IACI,YAAY;IACZ,mBAAmB;AACvB",sourcesContent:[`<template>
    <div class="auth-form container-background border-common" id="builder-id-form">
        <div v-show="canShowAll">
            <FormTitle :isConnected="isConnected">AWS Builder ID</FormTitle>

            <div v-if="stage === stages.START">
                <div class="form-section">
                    <div>
                        With AWS Builder ID, sign in for free without an AWS account.
                        <a href="https://docs.aws.amazon.com/signin/latest/userguide/sign-in-aws_builder_id.html"
                            >Read more.</a
                        >
                    </div>
                </div>

                <div class="form-section">
                    <button v-on:click="startSignIn()">Sign up or Sign in</button>
                </div>
            </div>

            <div v-if="stage === stages.WAITING_ON_USER">
                <div class="form-section">
                    <div>Follow instructions...</div>
                </div>
            </div>

            <div v-if="stage === stages.CONNECTED">
                <div class="form-section">
                    <div v-on:click="signout()" style="cursor: pointer; color: #75beff">Sign out</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { PropType, defineComponent } from 'vue'
import BaseAuthForm from './baseAuth.vue'
import FormTitle from './formTitle.vue'
import { AuthStatus } from './shared.vue'
import { WebviewClientFactory } from '../../../webviews/client'
import { AuthWebview } from '../show'
import authForms, { AuthFormId } from './types.vue'

const client = WebviewClientFactory.create<AuthWebview>()

/** Where the user is currently in the builder id setup process */
export const stages = {
    START: 'START',
    WAITING_ON_USER: 'WAITING_ON_USER',
    CONNECTED: 'CONNECTED',
} as const
type BuilderIdStage = (typeof stages)[keyof typeof stages]

export default defineComponent({
    name: 'CredentialsForm',
    extends: BaseAuthForm,
    components: { FormTitle },
    props: {
        state: {
            type: Object as PropType<BaseBuilderIdState>,
            required: true,
        },
        stages: {
            type: Object as PropType<typeof stages>,
            default: stages,
        },
    },
    data() {
        return {
            stage: stages.START as BuilderIdStage,
            isConnected: false,
            builderIdCode: '',
            canShowAll: false,
        }
    },
    async created() {
        await this.update()
        this.canShowAll = true
    },
    methods: {
        async startSignIn() {
            this.stage = this.stages.WAITING_ON_USER
            await this.state.startBuilderIdSetup()
            await this.update()
        },
        async update() {
            this.stage = await this.state.stage()
            this.isConnected = await this.state.isAuthConnected()
            this.emitAuthConnectionUpdated(this.state.id)
        },
        async signout() {
            await this.state.signout()

            this.update()
        },
    },
})

/**
 * Manages the state of Builder ID.
 */
abstract class BaseBuilderIdState implements AuthStatus {
    protected _stage: BuilderIdStage = stages.START

    abstract get id(): AuthFormId
    protected abstract _startBuilderIdSetup(): Promise<void>
    abstract isAuthConnected(): Promise<boolean>

    async startBuilderIdSetup(): Promise<void> {
        this._stage = stages.WAITING_ON_USER
        return this._startBuilderIdSetup()
    }

    async stage(): Promise<BuilderIdStage> {
        const isAuthConnected = await this.isAuthConnected()
        this._stage = isAuthConnected ? stages.CONNECTED : stages.START
        return this._stage
    }

    async signout(): Promise<void> {
        await client.signoutBuilderId()
    }
}

export class CodeWhispererBuilderIdState extends BaseBuilderIdState {
    override get id(): AuthFormId {
        return authForms.BUILDER_ID_CODE_WHISPERER
    }

    override isAuthConnected(): Promise<boolean> {
        return client.isCodeWhispererBuilderIdConnected()
    }

    protected override _startBuilderIdSetup(): Promise<void> {
        return client.startCodeWhispererBuilderIdSetup()
    }
}

export class CodeCatalystBuilderIdState extends BaseBuilderIdState {
    override get id(): AuthFormId {
        return authForms.BUILDER_ID_CODE_CATALYST
    }

    override isAuthConnected(): Promise<boolean> {
        return client.isCodeCatalystBuilderIdConnected()
    }

    protected override _startBuilderIdSetup(): Promise<void> {
        return client.startCodeCatalystBuilderIdSetup()
    }
}
<\/script>
<style>
@import './sharedAuthForms.css';
@import '../shared.css';

#builder-id-form {
    width: 250px;
    height: fit-content;
}
</style>
`],sourceRoot:""}]);const y=l},785:(e,r,n)=>{"use strict";n.r(r),n.d(r,{default:()=>y});var s=n(537),o=n.n(s),a=n(645),_=n.n(a),c=n(327),p=n(590),l=_()(o());l.i(c.Z),l.i(p.Z),l.push([e.id,`
#credentials-form {
    width: 300px;
}
#collapsible {
    display: flex;
    flex-direction: row;
    cursor: pointer;
}
`,"",{version:3,sources:["webpack://./src/credentials/vue/authForms/manageCredentials.vue"],names:[],mappings:";AA+QA;IACI,YAAY;AAChB;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,eAAe;AACnB",sourcesContent:[`<template>
    <div class="auth-form container-background border-common" id="credentials-form" v-show="canShowAll">
        <FormTitle :isConnected="isConnected">IAM Credentials</FormTitle>

        <div v-if="isConnected" class="form-section" v-on:click="toggleShowForm()" id="collapsible">
            <div :class="collapsibleClass"></div>
            <div>Add another profile</div>
        </div>

        <div v-if="isFormShown">
            <div class="form-section">
                <label class="small-description">Credentials will be added to the appropriate \`~/.aws/\` files.</label>
                <div>
                    <div class="icon icon-vscode-edit edit-icon"></div>
                    Edit file directly
                </div>
            </div>

            <div class="form-section">
                <label class="input-title">Profile Name</label>
                <label class="small-description">The identifier for these credentials</label>
                <input v-model="data.profileName" type="text" :data-invalid="!!errors.profileName" />
                <div class="small-description error-text">{{ errors.profileName }}</div>
            </div>

            <div class="form-section">
                <label class="input-title">Access Key</label>
                <label class="small-description">The access key</label>
                <input v-model="data.aws_access_key_id" :data-invalid="!!errors.aws_access_key_id" type="text" />
                <div class="small-description error-text">{{ errors.aws_access_key_id }}</div>
            </div>

            <div class="form-section">
                <label class="input-title">Secret Key</label>
                <label class="small-description">The secret key</label>
                <input
                    v-model="data.aws_secret_access_key"
                    type="password"
                    :data-invalid="!!errors.aws_secret_access_key"
                />
                <div class="small-description error-text">{{ errors.aws_secret_access_key }}</div>
            </div>

            <div class="form-section">
                <button :disabled="!canSubmit" v-on:click="submitData()">Add Profile</button>
                <div class="small-description error-text">{{ errors.submit }}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { PropType, defineComponent } from 'vue'
import BaseAuthForm from './baseAuth.vue'
import FormTitle from './formTitle.vue'
import { SectionName, StaticProfile } from '../../types'
import { WebviewClientFactory } from '../../../webviews/client'
import { AuthWebview } from '../show'
import { AuthStatus } from './shared.vue'

const client = WebviewClientFactory.create<AuthWebview>()

export default defineComponent({
    name: 'CredentialsForm',
    extends: BaseAuthForm,
    components: { FormTitle },
    props: {
        state: {
            type: Object as PropType<CredentialsState>,
            required: true,
        },
    },
    data() {
        return {
            data: {
                profileName: this.state.getValue('profileName'),
                aws_access_key_id: this.state.getValue('aws_access_key_id'),
                aws_secret_access_key: this.state.getValue('aws_secret_access_key'),
            },
            errors: {
                profileName: '',
                aws_access_key_id: '',
                aws_secret_access_key: '',
                submit: '',
            },
            canSubmit: false,
            isConnected: false,

            /**
             * This is for the edge case when we use an accordion and
             * need to know if we should show the form
             */
            isFormShown: false,

            /**
             * This exists since setup is run async and there is a visual
             * stutter when this form is first shown. This will not allow
             * anything to be shown until this is set to true
             */
            canShowAll: false,
        }
    },

    async created() {
        await this.updateDataError('profileName')
        await this.updateDataError('aws_access_key_id')
        await this.updateDataError('aws_secret_access_key')

        await Promise.all([this.updateConnectedStatus(), this.updateSubmittableStatus()])

        this.isFormShown = !this.isConnected

        this.canShowAll = true // make sure this is last
    },
    computed: {
        /** The appropriate accordion symbol (collapsed/uncollapsed) */
        collapsibleClass() {
            return this.isFormShown ? 'icon icon-vscode-chevron-down' : 'icon icon-vscode-chevron-right'
        },
    },
    methods: {
        setNewValue(key: CredentialsDataKey, newVal: string) {
            // If there is an error under the submit button
            // we can clear it since there is new data
            this.errors.submit = ''

            this.state.setValue(key, newVal.trim())
            this.updateSubmittableStatus()
            this.updateDataError(key)
        },
        /** Updates the error using the current data */
        async updateDataError(key: CredentialsDataKey): Promise<void> {
            return this.state.getFormatError(key).then(error => {
                this.errors[key] = error ?? ''
            })
        },
        async updateSubmittableStatus() {
            return this.state.getSubmissionErrors().then(errors => {
                this.canSubmit = errors === undefined
            })
        },
        async updateConnectedStatus() {
            return this.state.isAuthConnected().then(isConnected => {
                this.isConnected = isConnected
                this.emitAuthConnectionUpdated('CREDENTIALS')
            })
        },
        async submitData() {
            // pre submission
            this.canSubmit = false // disable submit button

            this.errors.submit = '' // Makes UI flicker if same message as before (shows something changed)
            this.errors.submit = await this.state.getAuthenticationError()
            if (this.errors.submit) {
                return // Do not allow submission since data fails authentication
            }

            // submission
            await this.state.submitData()

            // post submission (successfully connected)
            this.clearFormData()
            this.isFormShown = false
            this.canSubmit = true // enable submit button
            await this.updateConnectedStatus()
        },
        toggleShowForm() {
            this.isFormShown = !this.isFormShown
        },
        clearFormData() {
            // This indirectly clears the UI, then triggers the watch handlers
            this.data.profileName = ''
            this.data.aws_access_key_id = ''
            this.data.aws_secret_access_key = ''
        },
    },
    watch: {
        'data.profileName'(newVal) {
            this.setNewValue('profileName', newVal)
        },
        'data.aws_access_key_id'(newVal) {
            this.setNewValue('aws_access_key_id', newVal)
        },
        'data.aws_secret_access_key'(newVal) {
            this.setNewValue('aws_secret_access_key', newVal)
        },
    },
})

type CredentialsProfile = { profileName: SectionName } & StaticProfile
type CredentialsProfileOptional = Partial<CredentialsProfile>
type CredentialsProfileErrors = CredentialsProfileOptional
type CredentialsDataKey = keyof CredentialsProfile

/**
 * Manages the state of credentials data.
 */
export class CredentialsState implements AuthStatus {
    private _data: CredentialsProfile

    constructor(data?: CredentialsProfile) {
        this._data = {
            profileName: '',
            aws_access_key_id: '',
            aws_secret_access_key: '',
            ...data,
        }
    }

    setValue(key: CredentialsDataKey, value: string) {
        this._data[key] = value
    }

    getValue(key: CredentialsDataKey) {
        return this._data[key]
    }

    async isAuthConnected(): Promise<boolean> {
        return await client.isCredentialConnected()
    }

    async getFormatError(key: CredentialsDataKey): Promise<string | undefined> {
        if (key === 'profileName') {
            return client.getProfileNameError(this._data.profileName, false)
        }

        const result = await client.getCredentialFormatError(key, this._data[key])
        return result
    }

    async getSubmissionErrors(): Promise<CredentialsProfileErrors | undefined> {
        const profileNameError = await client.getProfileNameError(this._data.profileName)
        const formatErrors = await client.getCredentialsSubmissionErrors(this._data)

        // No errors for anything
        if (!profileNameError && !formatErrors) {
            return undefined
        }

        return {
            profileName: profileNameError,
            ...formatErrors,
        }
    }

    async getAuthenticationError(): Promise<string> {
        const error = await client.getAuthenticatedCredentialsError(this._data)
        if (!error) {
            return ''
        }
        return error.error
    }

    async submitData(): Promise<boolean> {
        const data = await this.getSubmittableDataOrThrow()
        return client.trySubmitCredentials(data.profileName, data)
    }

    private async getSubmittableDataOrThrow(): Promise<CredentialsProfile> {
        const errors = await this.getSubmissionErrors()
        const hasError = errors !== undefined
        if (hasError) {
            throw new Error(\`authWebview: data should be valid at this point, but is invalid: \${errors}\`)
        }
        return this._data as CredentialsProfile
    }
}
<\/script>
<style>
@import './sharedAuthForms.css';
@import '../shared.css';

#credentials-form {
    width: 300px;
}

#collapsible {
    display: flex;
    flex-direction: row;
    cursor: pointer;
}
</style>
`],sourceRoot:""}]);const y=l},764:(e,r,n)=>{"use strict";n.r(r),n.d(r,{default:()=>p});var s=n(537),o=n.n(s),a=n(645),_=n.n(a),c=_()(o());c.push([e.id,`
/** By default  */
.flex-container {
    display: flex;
    flex-direction: row;
}
#left-column {
    width: 500px;
    box-sizing: border-box;
    margin: 10px;
}
.service-item-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
}
.service-item-list li {
    /* Creates an even separation between all list items*/
    margin-top: 10px;
}
#right-column {
    /* This can be deleted, for development purposes */
    height: 800px;
    margin: 10px;
}
`,"",{version:3,sources:["webpack://./src/credentials/vue/root.vue"],names:[],mappings:";AAgOA,iBAAiB;AACjB;IACI,aAAa;IACb,mBAAmB;AACvB;AAEA;IACI,YAAY;IACZ,sBAAsB;IACtB,YAAY;AAChB;AAEA;IACI,qBAAqB;IACrB,SAAS;IACT,UAAU;AACd;AAEA;IACI,qDAAqD;IACrD,gBAAgB;AACpB;AAEA;IACI,kDAAkD;IAClD,aAAa;IACb,YAAY;AAChB",sourcesContent:[`<template>
    <div class="flex-container">
        <div id="left-column">
            <div>
                <div style="display: flex; justify-content: left; align-items: center; gap: 25px">
                    <div style="fill: white">
                        <svg
                            id="Layer_1"
                            data-name="Layer 1"
                            xmlns="http://www.w3.org/2000/svg"
                            width="52pt"
                            height="32pt"
                            viewBox="0 0 50 30"
                        >
                            <path
                                d="M14.09,10.85a4.7,4.7,0,0,0,.19,1.48,7.73,7.73,0,0,0,.54,1.19.77.77,0,0,1,.12.38.64.64,0,0,1-.32.49l-1,.7a.83.83,0,0,1-.44.15.69.69,0,0,1-.49-.23,3.8,3.8,0,0,1-.6-.77q-.25-.42-.51-1a6.14,6.14,0,0,1-4.89,2.3,4.54,4.54,0,0,1-3.32-1.19,4.27,4.27,0,0,1-1.22-3.2A4.28,4.28,0,0,1,3.61,7.75,6.06,6.06,0,0,1,7.69,6.46a12.47,12.47,0,0,1,1.76.13q.92.13,1.91.36V5.73a3.65,3.65,0,0,0-.79-2.66A3.81,3.81,0,0,0,7.86,2.3a7.71,7.71,0,0,0-1.79.22,12.78,12.78,0,0,0-1.79.57,4.55,4.55,0,0,1-.58.22l-.26,0q-.35,0-.35-.52V2a1.09,1.09,0,0,1,.12-.58,1.2,1.2,0,0,1,.47-.35A10.88,10.88,0,0,1,5.77.32,10.19,10.19,0,0,1,8.36,0a6,6,0,0,1,4.35,1.35,5.49,5.49,0,0,1,1.38,4.09ZM7.34,13.38a5.36,5.36,0,0,0,1.72-.31A3.63,3.63,0,0,0,10.63,12,2.62,2.62,0,0,0,11.19,11a5.63,5.63,0,0,0,.16-1.44v-.7a14.35,14.35,0,0,0-1.53-.28,12.37,12.37,0,0,0-1.56-.1,3.84,3.84,0,0,0-2.47.67A2.34,2.34,0,0,0,5,11a2.35,2.35,0,0,0,.61,1.76A2.4,2.4,0,0,0,7.34,13.38Zm13.35,1.8a1,1,0,0,1-.64-.16,1.3,1.3,0,0,1-.35-.65L15.81,1.51a3,3,0,0,1-.15-.67.36.36,0,0,1,.41-.41H17.7a1,1,0,0,1,.65.16,1.4,1.4,0,0,1,.33.65l2.79,11,2.59-11A1.17,1.17,0,0,1,24.39.6a1.1,1.1,0,0,1,.67-.16H26.4a1.1,1.1,0,0,1,.67.16,1.17,1.17,0,0,1,.32.65L30,12.39,32.88,1.25A1.39,1.39,0,0,1,33.22.6a1,1,0,0,1,.65-.16h1.54a.36.36,0,0,1,.41.41,1.36,1.36,0,0,1,0,.26,3.64,3.64,0,0,1-.12.41l-4,12.86a1.3,1.3,0,0,1-.35.65,1,1,0,0,1-.64.16H29.25a1,1,0,0,1-.67-.17,1.26,1.26,0,0,1-.32-.67L25.67,3.64,23.11,14.34a1.26,1.26,0,0,1-.32.67,1,1,0,0,1-.67.17Zm21.36.44a11.28,11.28,0,0,1-2.56-.29,7.44,7.44,0,0,1-1.92-.67,1,1,0,0,1-.61-.93v-.84q0-.52.38-.52a.9.9,0,0,1,.31.06l.42.17a8.77,8.77,0,0,0,1.83.58,9.78,9.78,0,0,0,2,.2,4.48,4.48,0,0,0,2.43-.55,1.76,1.76,0,0,0,.86-1.57,1.61,1.61,0,0,0-.45-1.16A4.29,4.29,0,0,0,43,9.22l-2.41-.76A5.15,5.15,0,0,1,38,6.78a3.94,3.94,0,0,1-.83-2.41,3.7,3.7,0,0,1,.45-1.85,4.47,4.47,0,0,1,1.19-1.37A5.27,5.27,0,0,1,40.51.29,7.4,7.4,0,0,1,42.6,0a8.87,8.87,0,0,1,1.12.07q.57.07,1.08.19t.95.26a4.27,4.27,0,0,1,.7.29,1.59,1.59,0,0,1,.49.41.94.94,0,0,1,.15.55v.79q0,.52-.38.52a1.76,1.76,0,0,1-.64-.2,7.74,7.74,0,0,0-3.2-.64,4.37,4.37,0,0,0-2.21.47,1.6,1.6,0,0,0-.79,1.48,1.58,1.58,0,0,0,.49,1.18,4.94,4.94,0,0,0,1.83.92L44.55,7a5.08,5.08,0,0,1,2.57,1.6A3.76,3.76,0,0,1,47.9,11a4.21,4.21,0,0,1-.44,1.93,4.4,4.4,0,0,1-1.21,1.47,5.43,5.43,0,0,1-1.85.93A8.25,8.25,0,0,1,42.05,15.62Z"
                            />
                            <path
                                class="cls-1"
                                d="M45.19,23.81C39.72,27.85,31.78,30,25,30A36.64,36.64,0,0,1,.22,20.57c-.51-.46-.06-1.09.56-.74A49.78,49.78,0,0,0,25.53,26.4,49.23,49.23,0,0,0,44.4,22.53C45.32,22.14,46.1,23.14,45.19,23.81Z"
                            />
                            <path
                                class="cls-1"
                                d="M47.47,21.21c-.7-.9-4.63-.42-6.39-.21-.53.06-.62-.4-.14-.74,3.13-2.2,8.27-1.57,8.86-.83s-.16,5.89-3.09,8.35c-.45.38-.88.18-.68-.32C46.69,25.8,48.17,22.11,47.47,21.21Z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h3>AWS Toolkit for VSCode</h3>
                        <h1>Welcome & Getting Started</h1>
                    </div>
                </div>
                <h1>Select a feature to get started</h1>
                <ul class="service-item-list" v-for="itemId in unlockedItemIds">
                    <ServiceItem
                        :title="getServiceItemProps(itemId).title"
                        :description="getServiceItemProps(itemId).description"
                        :status="'UNLOCKED'"
                        :isSelected="isServiceSelected(itemId)"
                        :isLandscape="isLandscape"
                        :id="itemId"
                        :key="buildServiceItemKey(itemId, 'UNLOCKED')"
                        @service-item-clicked="serviceWasSelected(itemId)"
                    >
                        <template v-slot:service-item-content-slot v-if="isServiceSelected(itemId) && !isLandscape">
                            <component
                                :is="getServiceItemContent(itemId)"
                                :state="serviceItemsAuthStatus[itemId]"
                                :key="itemId + rerenderContentWindowKey"
                                @is-auth-connected="onIsAuthConnected"
                            ></component>
                        </template>
                    </ServiceItem>
                </ul>
            </div>

            <div>
                <h3>ENABLE ADDITIONAL FEATURES</h3>

                <ul class="service-item-list" v-for="itemId in lockedItemIds">
                    <ServiceItem
                        :title="getServiceItemProps(itemId).title"
                        :description="getServiceItemProps(itemId).description"
                        :status="'LOCKED'"
                        :isSelected="isServiceSelected(itemId)"
                        :isLandscape="isLandscape"
                        :id="itemId"
                        :key="buildServiceItemKey(itemId, 'LOCKED')"
                        @service-item-clicked="serviceWasSelected(itemId)"
                    >
                        <template v-slot:service-item-content-slot v-if="isServiceSelected(itemId) && !isLandscape">
                            <component
                                :is="getServiceItemContent(itemId)"
                                :state="serviceItemsAuthStatus[itemId]"
                                :key="itemId + rerenderContentWindowKey"
                                @is-auth-connected="onIsAuthConnected"
                            ></component>
                        </template>
                    </ServiceItem>
                </ul>
            </div>
            <h3></h3>
        </div>
        <div v-if="isLandscape && isAnyServiceSelected" id="right-column">
            <component
                :is="getServiceItemContent(getSelectedService())"
                :state="serviceItemsAuthStatus[getSelectedService()]"
                :key="getSelectedService() + rerenderContentWindowKey"
                @is-auth-connected="onIsAuthConnected"
            ></component>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ServiceItem, { ServiceItemsState, ServiceItemId, ServiceStatus, StaticServiceItemProps } from './serviceItem.vue'
import serviceItemsContent, { serviceItemsAuthStatus } from './serviceItemContent/shared.vue'
import { WebviewClientFactory } from '../../webviews/client'
import { AuthWebview } from './show'

const client = WebviewClientFactory.create<AuthWebview>()
const serviceItemsState = new ServiceItemsState()

export default defineComponent({
    components: { ServiceItem },
    name: 'AuthRoot',
    data() {
        return {
            unlockedItemIds: [] as ServiceItemId[],
            lockedItemIds: [] as ServiceItemId[],
            currWindowWidth: window.innerWidth,

            serviceItemsAuthStatus: serviceItemsAuthStatus,

            rerenderContentWindowKey: 0,
        }
    },
    async created() {
        await this.updateServiceConnections()

        // This handles the case where non-webview auth setup is used.
        // This will detect their resulting changes to auth
        // and it will have this webview update to get the latest info.
        client.onDidConnectionUpdate(() => {
            this.updateServiceConnections()
            // This handles the edge case where we have selected a service item
            // and its content window is being shown. If there is an external
            // event that changes the state of this service (eg: disconnected)
            // this forced rerender will display the new state
            this.rerenderSelectedContentWindow()
        })
    },
    mounted() {
        window.addEventListener('resize', this.updateWindowWidth)
    },
    unmounted() {
        window.removeEventListener('resize', this.updateWindowWidth)
    },
    computed: {
        isLandscape() {
            return this.currWindowWidth > 1300
        },
        isAnyServiceSelected(): boolean {
            return serviceItemsState.selected !== undefined
        },
    },
    methods: {
        /**
         * Triggers a rendering of the service items.
         */
        renderItems() {
            const { unlocked, locked } = serviceItemsState.getServiceIds()
            this.unlockedItemIds = unlocked
            this.lockedItemIds = locked
        },
        isServiceSelected(id: ServiceItemId): boolean {
            return serviceItemsState.selected === id
        },
        getSelectedService(): ServiceItemId {
            return serviceItemsState.selected!
        },
        getServiceItemProps(id: ServiceItemId): StaticServiceItemProps {
            return serviceItemsState.getStaticServiceItemProps(id)
        },
        serviceWasSelected(id: ServiceItemId): void {
            serviceItemsState.select(id)
            this.renderItems()
        },
        /**
         * Builds a unique key for a service item to optimize re-rendering.
         *
         * This allows Vue to know which existing component to compare to the new one.
         * https://vuejs.org/api/built-in-special-attributes.html#key
         */
        buildServiceItemKey(id: ServiceItemId, lockStatus: ServiceStatus) {
            return id + '_' + (this.isServiceSelected(id) ? \`\${lockStatus}_SELECTED\` : \`\${lockStatus}\`)
        },
        updateWindowWidth() {
            this.currWindowWidth = window.innerWidth
        },
        getServiceItemContent(id: ServiceItemId) {
            return serviceItemsContent[id]
        },
        updateServiceLock(id: ServiceItemId, isAuthConnected: boolean) {
            if (isAuthConnected) {
                serviceItemsState.unlock(id)
            } else {
                serviceItemsState.lock(id)
            }
        },
        onIsAuthConnected(id: ServiceItemId, isConnected: boolean) {
            this.updateServiceLock(id, isConnected)
            this.renderItems()
            // In some cases, during the connection process for one auth method,
            // an already connected auth can be disconnected. This refreshes all
            // auths to show the user the latest state of everything.
            this.updateServiceConnections()
        },
        async updateServiceConnections() {
            return Promise.all([
                this.serviceItemsAuthStatus.RESOURCE_EXPLORER.isAuthConnected().then(isConnected => {
                    this.updateServiceLock('RESOURCE_EXPLORER', isConnected)
                }),
                this.serviceItemsAuthStatus.CODE_WHISPERER.isAuthConnected().then(isConnected => {
                    this.updateServiceLock('CODE_WHISPERER', isConnected)
                }),
                this.serviceItemsAuthStatus.CODE_CATALYST.isAuthConnected().then(isConnected => {
                    this.updateServiceLock('CODE_CATALYST', isConnected)
                }),
            ]).then(() => this.renderItems())
        },
        /**
         * This will trigger a re-rendering of the currently shown content window.
         */
        rerenderSelectedContentWindow() {
            // Arbitrarily toggles value between 0 and 1
            this.rerenderContentWindowKey = this.rerenderContentWindowKey === 0 ? 1 : 0
        },
    },
})
<\/script>

<style>
/** By default  */
.flex-container {
    display: flex;
    flex-direction: row;
}

#left-column {
    width: 500px;
    box-sizing: border-box;
    margin: 10px;
}

.service-item-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

.service-item-list li {
    /* Creates an even separation between all list items*/
    margin-top: 10px;
}

#right-column {
    /* This can be deleted, for development purposes */
    height: 800px;
    margin: 10px;
}
</style>
`],sourceRoot:""}]);const p=c},878:(e,r,n)=>{"use strict";n.r(r),n.d(r,{default:()=>l});var s=n(537),o=n.n(s),a=n(645),_=n.n(a),c=n(590),p=_()(o());p.i(c.Z),p.push([e.id,`
/* ******** Container ******** */
.service-item-container {
    background-color: #292929;
    display: flex;
    margin-top: 10px;
    padding: 20px 15px 20px 15px;

    min-height: 35px;

    /* Icon and text are centered on the secondary axis */
    align-items: center;

    cursor: pointer;
}

/* When a service item was clicked */
.service-item-container-selected {
    background-color: #3c3c3c;
    border-color: #0097fb;
}

/* ******** Icon ******** */
.icon-item {
    /* Separation between icon and text */
    margin-right: 15px;
}

/* The checkmark symbol */
.unlocked {
    color: #73c991;
}

/* The lock symbol but the user has clicked it */
.locked-selected {
    color: #0097fb;
}

/* ******** Text ******** */
.service-item-title {
    color: #ffffff;
    font-size: 13px;
    font-weight: 800;
    font-family: 'Verdana';
    line-height: 16px;
    margin-bottom: 5px;
    margin-top: 0;
}
.service-item-description {
    color: #cccccc;
    font-size: 12px;
    font-weight: 500;
    font-family: 'Verdana';
    line-height: 14px;
    margin-bottom: 0;
    margin-top: 0;
}
.text-info-container {
    display: flex;
    flex-direction: column;
    text-align: left;
}

/* ******** Service Item Content Container ******** */
.service-item-content-list-item:empty {
    display: none;
}
`,"",{version:3,sources:["webpack://./src/credentials/vue/serviceItem.vue"],names:[],mappings:";AA6OA,gCAAgC;AAEhC;IACI,yBAAyB;IACzB,aAAa;IACb,gBAAgB;IAChB,4BAA4B;;IAE5B,gBAAgB;;IAEhB,qDAAqD;IACrD,mBAAmB;;IAEnB,eAAe;AACnB;;AAEA,oCAAoC;AACpC;IACI,yBAAyB;IACzB,qBAAqB;AACzB;;AAEA,2BAA2B;AAC3B;IACI,qCAAqC;IACrC,kBAAkB;AACtB;;AAEA,yBAAyB;AACzB;IACI,cAAc;AAClB;;AAEA,gDAAgD;AAChD;IACI,cAAc;AAClB;;AAEA,2BAA2B;AAE3B;IACI,cAAc;IACd,eAAe;IACf,gBAAgB;IAChB,sBAAsB;IACtB,iBAAiB;IACjB,kBAAkB;IAClB,aAAa;AACjB;AAEA;IACI,cAAc;IACd,eAAe;IACf,gBAAgB;IAChB,sBAAsB;IACtB,iBAAiB;IACjB,gBAAgB;IAChB,aAAa;AACjB;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,gBAAgB;AACpB;;AAEA,qDAAqD;AAErD;IACI,aAAa;AACjB",sourcesContent:[`<!--
    This module focuses on the clickable box that represents a specific service/feature
    on the left side of the screen. It defines the base structure of the component and
    from there specific service item components can be defined.

    Additionaly, this module provides a state manager to keep track of the state of
    of the service items.
 -->
<template>
    <li :class="[classWhenIsSelected, 'service-item-container', 'border-common']" v-on:mousedown="serviceItemClicked">
        <!-- The icon -->
        <div class="icon-item" :class="serviceIconClass"></div>

        <!-- The text info -->
        <div class="text-info-container">
            <div class="service-item-title">
                {{ title }}
            </div>
            <div class="service-item-description">
                {{ description }}
            </div>
        </div>
    </li>

    <li class="service-item-content-list-item">
        <!-- See 'Named Slots' for more info -->
        <slot name="service-item-content-slot"></slot>
    </li>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'

/* The status of the icon for a service */
type ServiceIconStatus = keyof typeof serviceIconClasses

/* The general status of the service */
export type ServiceStatus = Exclude<ServiceIconStatus, 'LOCKED_SELECTED'>

/**
 * Maps a service status to the CSS classes that will create the icon.
 *
 * LOCKED_SELECTED is a case where the item is locked but selected by the user.
 */
const serviceIconClasses = {
    LOCKED: 'icon icon-lg icon-vscode-lock',
    LOCKED_SELECTED: 'icon icon-lg icon-vscode-lock locked-selected',
    UNLOCKED: 'icon icon-lg icon-vscode-check unlocked',
} as const

/**
 * The static props that are expected to be passed to a ServiceItem component.
 *
 * Static here implies that these props are not expected to change after the component is created.
 */
export interface StaticServiceItemProps {
    title: string
    description: string
}

/**
 * The base component for a service item that should be extended
 * by specific service item components.
 */
export default defineComponent({
    name: 'ServiceItem',
    components: {},
    emits: ['service-item-clicked'],
    props: {
        id: {
            type: String as PropType<ServiceItemId>,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String as PropType<ServiceStatus>,
            default: 'LOCKED',
        },
        isSelected: {
            type: Boolean,
            default: false,
        },
        isLandscape: {
            type: Boolean,
            required: true,
            description: 'Whether the screen is in landscape mode or not.',
        },
    },
    data() {
        return {
            classWhenIsSelected: '',
            serviceIconClasses: serviceIconClasses,
            serviceIconClass: '',
        }
    },
    created() {
        // The CSS class that should be applied to the container when the item is selected.
        this.classWhenIsSelected = this.isSelected ? 'service-item-container-selected' : ''

        // The CSS class that determines which icon to show.
        const serviceIconStatus: ServiceIconStatus =
            this.isSelected && this.status === 'LOCKED' ? 'LOCKED_SELECTED' : this.status
        this.serviceIconClass = this.serviceIconClasses[serviceIconStatus]
    },
    methods: {
        serviceItemClicked() {
            this.$emit('service-item-clicked', this.id)
        },
    },
})

/**
 * ------------------- Service Item Implementations -------------------
 *
 * All specific service item components should be defined below.
 */

/**
 * A Service Item ID is the main identifier/representation of a specific service item.
 */
export type ServiceItemId = (typeof serviceItemIds)[keyof typeof serviceItemIds]

export const serviceItemIds = {
    NON_AUTH_FEATURES: 'NON_AUTH_FEATURES',
    RESOURCE_EXPLORER: 'RESOURCE_EXPLORER',
    CODE_WHISPERER: 'CODE_WHISPERER',
    CODE_CATALYST: 'CODE_CATALYST',
} as const

const staticServiceItemProps = {
    [serviceItemIds.NON_AUTH_FEATURES]: {
        title: 'Debug Lambda Functions & Edit AWS Document Types',
        description: "Local features that don't require authentication.",
    },
    [serviceItemIds.RESOURCE_EXPLORER]: {
        title: 'Resource Explorer',
        description: 'View, modify, deploy, and troubleshoot AWS resources.',
    },
    [serviceItemIds.CODE_WHISPERER]: {
        title: 'Amazon CodeWhisperer',
        description: 'Build applications faster with AI code recommendations.',
    },
    [serviceItemIds.CODE_CATALYST]: {
        title: 'Amazon CodeCatalyst',
        description: 'Spark a faster planning, development, and delivery lifecycle on AWS.',
    },
} as const

/* -------------------------------------- */

/**
 * This class is responsible for keeping track of the state of all service items.
 *
 * As the user interacts with the service items, certain methods of this class
 * can be used to update the state of specific service items. Then, the method
 * {@link getServiceIds} can be used to get the latest state of all service items.
 */
export class ServiceItemsState {
    /**
     * IDs of all services that are currently unlocked
     *
     * Note the default unlocked service(s) are pre-defined here.
     */
    private readonly unlockedServices: Set<ServiceItemId> = new Set([serviceItemIds.NON_AUTH_FEATURES])

    /** Note a service item is pre-selected by default */
    private currentlySelected?: ServiceItemId = serviceItemIds.NON_AUTH_FEATURES

    /**
     * The Ids of the service items, separated by the ones that are locked vs. unlocked
     *
     * IMPORTANT: This is the source of truth of the current state of all service items.
     *            Use the methods of this class to modify the states of items, then use
     *            this method to get the latest state.
     */
    getServiceIds(): { unlocked: ServiceItemId[]; locked: ServiceItemId[] } {
        const allServiceIds = Object.keys(staticServiceItemProps) as ServiceItemId[]
        const unlockedConstructorIds = allServiceIds.filter(id => this.unlockedServices.has(id))
        const lockedConstructorIds = allServiceIds.filter(id => !this.unlockedServices.has(id))

        return {
            unlocked: unlockedConstructorIds,
            locked: lockedConstructorIds,
        }
    }

    /**
     * Static Service Item props are the props that are not expected to change
     * after the component is created.
     */
    getStaticServiceItemProps(id: ServiceItemId): StaticServiceItemProps {
        return staticServiceItemProps[id]
    }

    /** The currently selected service item */
    get selected(): ServiceItemId | undefined {
        return this.currentlySelected
    }

    /** Marks the item as selected by the user */
    select(id: ServiceItemId) {
        this.currentlySelected = id
    }

    deselect() {
        this.currentlySelected = undefined
    }

    toggleSelected(id: ServiceItemId) {
        if (this.currentlySelected === id) {
            this.deselect()
        } else {
            this.select(id)
        }
    }

    /** Marks the item as being 'unlocked', implying the required auth is completed. */
    unlock(id: ServiceItemId) {
        this.unlockedServices.add(id)
    }

    /** Marks the item as being 'locked', implying the required auth is NOT completed. */
    lock(id: ServiceItemId) {
        this.unlockedServices.delete(id)
    }
}
<\/script>

<style>
@import './shared.css';

/* ******** Container ******** */

.service-item-container {
    background-color: #292929;
    display: flex;
    margin-top: 10px;
    padding: 20px 15px 20px 15px;

    min-height: 35px;

    /* Icon and text are centered on the secondary axis */
    align-items: center;

    cursor: pointer;
}

/* When a service item was clicked */
.service-item-container-selected {
    background-color: #3c3c3c;
    border-color: #0097fb;
}

/* ******** Icon ******** */
.icon-item {
    /* Separation between icon and text */
    margin-right: 15px;
}

/* The checkmark symbol */
.unlocked {
    color: #73c991;
}

/* The lock symbol but the user has clicked it */
.locked-selected {
    color: #0097fb;
}

/* ******** Text ******** */

.service-item-title {
    color: #ffffff;
    font-size: 13px;
    font-weight: 800;
    font-family: 'Verdana';
    line-height: 16px;
    margin-bottom: 5px;
    margin-top: 0;
}

.service-item-description {
    color: #cccccc;
    font-size: 12px;
    font-weight: 500;
    font-family: 'Verdana';
    line-height: 14px;
    margin-bottom: 0;
    margin-top: 0;
}

.text-info-container {
    display: flex;
    flex-direction: column;
    text-align: left;
}

/* ******** Service Item Content Container ******** */

.service-item-content-list-item:empty {
    display: none;
}
</style>
`],sourceRoot:""}]);const l=p},314:(e,r,n)=>{"use strict";n.r(r),n.d(r,{default:()=>y});var s=n(537),o=n.n(s),a=n(645),_=n.n(a),c=n(30),p=n(590),l=_()(o());l.i(c.Z),l.i(p.Z),l.push([e.id,`
`,"",{version:3,sources:[],names:[],mappings:"",sourceRoot:""}]);const y=l},447:(e,r,n)=>{"use strict";n.r(r),n.d(r,{default:()=>y});var s=n(537),o=n.n(s),a=n(645),_=n.n(a),c=n(30),p=n(590),l=_()(o());l.i(c.Z),l.i(p.Z),l.push([e.id,`
`,"",{version:3,sources:[],names:[],mappings:"",sourceRoot:""}]);const y=l},353:(e,r,n)=>{"use strict";n.r(r),n.d(r,{default:()=>y});var s=n(537),o=n.n(s),a=n(645),_=n.n(a),c=n(30),p=n(590),l=_()(o());l.i(c.Z),l.i(p.Z),l.push([e.id,`
`,"",{version:3,sources:[],names:[],mappings:"",sourceRoot:""}]);const y=l},205:(e,r,n)=>{"use strict";n.r(r),n.d(r,{default:()=>y});var s=n(537),o=n.n(s),a=n(645),_=n.n(a),c=n(30),p=n(590),l=_()(o());l.i(c.Z),l.i(p.Z),l.push([e.id,`
`,"",{version:3,sources:[],names:[],mappings:"",sourceRoot:""}]);const y=l},327:(e,r,n)=>{"use strict";n.d(r,{Z:()=>p});var s=n(537),o=n.n(s),a=n(645),_=n.n(a),c=_()(o());c.push([e.id,`.auth-form {
    display: flex;
    flex-direction: column;
    text-align: left;

    padding: 10px;
}

/* A grouping of related elements in an auth form */
.auth-form .form-section {
    margin-top: 15px;

    display: flex;
    flex-direction: column;
}

/* Consistent margins between the elements of a grouping of elements */
.auth-form .form-section > * {
    margin-top: 3px;
}

.auth-form-title {
    font-size: 14px;
    font-weight: bold;
    color: #ffffff;
}

.input-title {
    font-size: 12px;
    color: #ffffff;
}

.small-description {
    font-size: 10px;
    color: #cccccc;
}

.edit-icon {
    color: #0078d7;
}

.error-text {
    color: #f14c4c;
}

input[data-invalid='true'] {
    /* Using important since base.css overrides these errors */
    /* TODO: If I can get base.css to be resolved before this the important is not needed */
    border: 1px solid !important;
    border-color: #f14c4c !important;
}

/* When an input box is clicked and has invalid data*/
input[data-invalid='true']:focus {
    /* Ensures the border stays red even when selected */
    outline: none !important;
}

/* Remove underline from anchor elements */
a {
    text-decoration: none;
}
`,"",{version:3,sources:["webpack://./src/credentials/vue/authForms/sharedAuthForms.css"],names:[],mappings:"AAAA;IACI,aAAa;IACb,sBAAsB;IACtB,gBAAgB;;IAEhB,aAAa;AACjB;;AAEA,mDAAmD;AACnD;IACI,gBAAgB;;IAEhB,aAAa;IACb,sBAAsB;AAC1B;;AAEA,sEAAsE;AACtE;IACI,eAAe;AACnB;;AAEA;IACI,eAAe;IACf,iBAAiB;IACjB,cAAc;AAClB;;AAEA;IACI,eAAe;IACf,cAAc;AAClB;;AAEA;IACI,eAAe;IACf,cAAc;AAClB;;AAEA;IACI,cAAc;AAClB;;AAEA;IACI,cAAc;AAClB;;AAEA;IACI,0DAA0D;IAC1D,uFAAuF;IACvF,4BAA4B;IAC5B,gCAAgC;AACpC;;AAEA,qDAAqD;AACrD;IACI,oDAAoD;IACpD,wBAAwB;AAC5B;;AAEA,0CAA0C;AAC1C;IACI,qBAAqB;AACzB",sourcesContent:[`.auth-form {
    display: flex;
    flex-direction: column;
    text-align: left;

    padding: 10px;
}

/* A grouping of related elements in an auth form */
.auth-form .form-section {
    margin-top: 15px;

    display: flex;
    flex-direction: column;
}

/* Consistent margins between the elements of a grouping of elements */
.auth-form .form-section > * {
    margin-top: 3px;
}

.auth-form-title {
    font-size: 14px;
    font-weight: bold;
    color: #ffffff;
}

.input-title {
    font-size: 12px;
    color: #ffffff;
}

.small-description {
    font-size: 10px;
    color: #cccccc;
}

.edit-icon {
    color: #0078d7;
}

.error-text {
    color: #f14c4c;
}

input[data-invalid='true'] {
    /* Using important since base.css overrides these errors */
    /* TODO: If I can get base.css to be resolved before this the important is not needed */
    border: 1px solid !important;
    border-color: #f14c4c !important;
}

/* When an input box is clicked and has invalid data*/
input[data-invalid='true']:focus {
    /* Ensures the border stays red even when selected */
    outline: none !important;
}

/* Remove underline from anchor elements */
a {
    text-decoration: none;
}
`],sourceRoot:""}]);const p=c},30:(e,r,n)=>{"use strict";n.d(r,{Z:()=>p});var s=n(537),o=n.n(s),a=n(645),_=n.n(a),c=_()(o());c.push([e.id,`.service-item-content-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    border-color: #0097fb;

    width: 700px;
    height: 100%;

    /* For testing purposes, before we have content to fill */
    min-height: 600px;
}
`,"",{version:3,sources:["webpack://./src/credentials/vue/serviceItemContent/baseServiceItemContent.css"],names:[],mappings:"AAAA;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;IACnB,uBAAuB;;IAEvB,qBAAqB;;IAErB,YAAY;IACZ,YAAY;;IAEZ,yDAAyD;IACzD,iBAAiB;AACrB",sourcesContent:[`.service-item-content-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    border-color: #0097fb;

    width: 700px;
    height: 100%;

    /* For testing purposes, before we have content to fill */
    min-height: 600px;
}
`],sourceRoot:""}]);const p=c},590:(e,r,n)=>{"use strict";n.d(r,{Z:()=>p});var s=n(537),o=n.n(s),a=n(645),_=n.n(a),c=_()(o());c.push([e.id,`/* Shared */

button,
.border-common {
    border-style: solid;
    border-width: 2px;
    border-radius: 4px;
    border-color: transparent;
}

/*  */
.container-background {
    background-color: #292929;
}
`,"",{version:3,sources:["webpack://./src/credentials/vue/shared.css"],names:[],mappings:"AAAA,WAAW;;AAEX;;IAEI,mBAAmB;IACnB,iBAAiB;IACjB,kBAAkB;IAClB,yBAAyB;AAC7B;;AAEA,KAAK;AACL;IACI,yBAAyB;AAC7B",sourcesContent:[`/* Shared */

button,
.border-common {
    border-style: solid;
    border-width: 2px;
    border-radius: 4px;
    border-color: transparent;
}

/*  */
.container-background {
    background-color: #292929;
}
`],sourceRoot:""}]);const p=c},645:e=>{"use strict";e.exports=function(r){var n=[];return n.toString=function(){return this.map(function(o){var a="",_=typeof o[5]!="undefined";return o[4]&&(a+="@supports (".concat(o[4],") {")),o[2]&&(a+="@media ".concat(o[2]," {")),_&&(a+="@layer".concat(o[5].length>0?" ".concat(o[5]):""," {")),a+=r(o),_&&(a+="}"),o[2]&&(a+="}"),o[4]&&(a+="}"),a}).join("")},n.i=function(o,a,_,c,p){typeof o=="string"&&(o=[[null,o,void 0]]);var l={};if(_)for(var y=0;y<this.length;y++){var L=this[y][0];L!=null&&(l[L]=!0)}for(var R=0;R<o.length;R++){var C=[].concat(o[R]);_&&l[C[0]]||(typeof p!="undefined"&&(typeof C[5]=="undefined"||(C[1]="@layer".concat(C[5].length>0?" ".concat(C[5]):""," {").concat(C[1],"}")),C[5]=p),a&&(C[2]&&(C[1]="@media ".concat(C[2]," {").concat(C[1],"}")),C[2]=a),c&&(C[4]?(C[1]="@supports (".concat(C[4],") {").concat(C[1],"}"),C[4]=c):C[4]="".concat(c)),n.push(C))}},n}},537:e=>{"use strict";e.exports=function(r){var n=r[1],s=r[3];if(!s)return n;if(typeof btoa=="function"){var o=btoa(unescape(encodeURIComponent(JSON.stringify(s)))),a="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(o),_="/*# ".concat(a," */");return[n].concat([_]).join(`
`)}return[n].join(`
`)}},744:(e,r)=>{"use strict";var n;n={value:!0},r.Z=(s,o)=>{const a=s.__vccOpts||s;for(const[_,c]of o)a[_]=c;return a}},423:(e,r,n)=>{var s=n(459);s.__esModule&&(s=s.default),typeof s=="string"&&(s=[[e.id,s,""]]),s.locals&&(e.exports=s.locals);var o=n(346).Z,a=o("6303a037",s,!1,{})},536:(e,r,n)=>{var s=n(911);s.__esModule&&(s=s.default),typeof s=="string"&&(s=[[e.id,s,""]]),s.locals&&(e.exports=s.locals);var o=n(346).Z,a=o("04a85e4d",s,!1,{})},510:(e,r,n)=>{var s=n(785);s.__esModule&&(s=s.default),typeof s=="string"&&(s=[[e.id,s,""]]),s.locals&&(e.exports=s.locals);var o=n(346).Z,a=o("220451d0",s,!1,{})},414:(e,r,n)=>{var s=n(764);s.__esModule&&(s=s.default),typeof s=="string"&&(s=[[e.id,s,""]]),s.locals&&(e.exports=s.locals);var o=n(346).Z,a=o("20cc29e8",s,!1,{})},803:(e,r,n)=>{var s=n(878);s.__esModule&&(s=s.default),typeof s=="string"&&(s=[[e.id,s,""]]),s.locals&&(e.exports=s.locals);var o=n(346).Z,a=o("82e1873c",s,!1,{})},824:(e,r,n)=>{var s=n(314);s.__esModule&&(s=s.default),typeof s=="string"&&(s=[[e.id,s,""]]),s.locals&&(e.exports=s.locals);var o=n(346).Z,a=o("32a8737c",s,!1,{})},446:(e,r,n)=>{var s=n(447);s.__esModule&&(s=s.default),typeof s=="string"&&(s=[[e.id,s,""]]),s.locals&&(e.exports=s.locals);var o=n(346).Z,a=o("0a587eef",s,!1,{})},437:(e,r,n)=>{var s=n(353);s.__esModule&&(s=s.default),typeof s=="string"&&(s=[[e.id,s,""]]),s.locals&&(e.exports=s.locals);var o=n(346).Z,a=o("30f866fd",s,!1,{})},743:(e,r,n)=>{var s=n(205);s.__esModule&&(s=s.default),typeof s=="string"&&(s=[[e.id,s,""]]),s.locals&&(e.exports=s.locals);var o=n(346).Z,a=o("6542a25a",s,!1,{})},346:(e,r,n)=>{"use strict";n.d(r,{Z:()=>J});function s(d,f){for(var A=[],h={},u=0;u<f.length;u++){var w=f[u],I=w[0],k=w[1],b=w[2],U=w[3],O={id:d+":"+u,css:k,media:b,sourceMap:U};h[I]?h[I].parts.push(O):A.push(h[I]={id:I,parts:[O]})}return A}var o=typeof document!="undefined";if(typeof DEBUG!="undefined"&&DEBUG&&!o)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var a={},_=o&&(document.head||document.getElementsByTagName("head")[0]),c=null,p=0,l=!1,y=function(){},L=null,R="data-vue-ssr-id",C=typeof navigator!="undefined"&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function J(d,f,A,h){l=A,L=h||{};var u=s(d,f);return H(u),function(I){for(var k=[],b=0;b<u.length;b++){var U=u[b],O=a[U.id];O.refs--,k.push(O)}I?(u=s(d,I),H(u)):u=[];for(var b=0;b<k.length;b++){var O=k[b];if(O.refs===0){for(var F=0;F<O.parts.length;F++)O.parts[F]();delete a[O.id]}}}}function H(d){for(var f=0;f<d.length;f++){var A=d[f],h=a[A.id];if(h){h.refs++;for(var u=0;u<h.parts.length;u++)h.parts[u](A.parts[u]);for(;u<A.parts.length;u++)h.parts.push(D(A.parts[u]));h.parts.length>A.parts.length&&(h.parts.length=A.parts.length)}else{for(var w=[],u=0;u<A.parts.length;u++)w.push(D(A.parts[u]));a[A.id]={id:A.id,refs:1,parts:w}}}}function X(){var d=document.createElement("style");return d.type="text/css",_.appendChild(d),d}function D(d){var f,A,h=document.querySelector("style["+R+'~="'+d.id+'"]');if(h){if(l)return y;h.parentNode.removeChild(h)}if(C){var u=p++;h=c||(c=X()),f=Y.bind(null,h,u,!1),A=Y.bind(null,h,u,!0)}else h=X(),f=te.bind(null,h),A=function(){h.parentNode.removeChild(h)};return f(d),function(I){if(I){if(I.css===d.css&&I.media===d.media&&I.sourceMap===d.sourceMap)return;f(d=I)}else A()}}var z=function(){var d=[];return function(f,A){return d[f]=A,d.filter(Boolean).join(`
`)}}();function Y(d,f,A,h){var u=A?"":h.css;if(d.styleSheet)d.styleSheet.cssText=z(f,u);else{var w=document.createTextNode(u),I=d.childNodes;I[f]&&d.removeChild(I[f]),I.length?d.insertBefore(w,I[f]):d.appendChild(w)}}function te(d,f){var A=f.css,h=f.media,u=f.sourceMap;if(h&&d.setAttribute("media",h),L.ssrId&&d.setAttribute(R,f.id),u&&(A+=`
/*# sourceURL=`+u.sources[0]+" */",A+=`
/*# sourceMappingURL=data:application/json;base64,`+btoa(unescape(encodeURIComponent(JSON.stringify(u))))+" */"),d.styleSheet)d.styleSheet.cssText=A;else{for(;d.firstChild;)d.removeChild(d.firstChild);d.appendChild(document.createTextNode(A))}}}},Q={};function g(e){var r=Q[e];if(r!==void 0)return r.exports;var n=Q[e]={id:e,exports:{}};return de[e](n,n.exports,g),n.exports}g.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return g.d(r,{a:r}),r},g.d=(e,r)=>{for(var n in r)g.o(r,n)&&!g.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:r[n]})},g.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),g.r=e=>{typeof Symbol!="undefined"&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var Z={};(()=>{"use strict";g.r(Z);const e=Vue,r={class:"flex-container"},n={id:"left-column"},s=(0,e.createStaticVNode)('<div style="display:flex;justify-content:left;align-items:center;gap:25px;"><div style="fill:white;"><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="52pt" height="32pt" viewBox="0 0 50 30"><path d="M14.09,10.85a4.7,4.7,0,0,0,.19,1.48,7.73,7.73,0,0,0,.54,1.19.77.77,0,0,1,.12.38.64.64,0,0,1-.32.49l-1,.7a.83.83,0,0,1-.44.15.69.69,0,0,1-.49-.23,3.8,3.8,0,0,1-.6-.77q-.25-.42-.51-1a6.14,6.14,0,0,1-4.89,2.3,4.54,4.54,0,0,1-3.32-1.19,4.27,4.27,0,0,1-1.22-3.2A4.28,4.28,0,0,1,3.61,7.75,6.06,6.06,0,0,1,7.69,6.46a12.47,12.47,0,0,1,1.76.13q.92.13,1.91.36V5.73a3.65,3.65,0,0,0-.79-2.66A3.81,3.81,0,0,0,7.86,2.3a7.71,7.71,0,0,0-1.79.22,12.78,12.78,0,0,0-1.79.57,4.55,4.55,0,0,1-.58.22l-.26,0q-.35,0-.35-.52V2a1.09,1.09,0,0,1,.12-.58,1.2,1.2,0,0,1,.47-.35A10.88,10.88,0,0,1,5.77.32,10.19,10.19,0,0,1,8.36,0a6,6,0,0,1,4.35,1.35,5.49,5.49,0,0,1,1.38,4.09ZM7.34,13.38a5.36,5.36,0,0,0,1.72-.31A3.63,3.63,0,0,0,10.63,12,2.62,2.62,0,0,0,11.19,11a5.63,5.63,0,0,0,.16-1.44v-.7a14.35,14.35,0,0,0-1.53-.28,12.37,12.37,0,0,0-1.56-.1,3.84,3.84,0,0,0-2.47.67A2.34,2.34,0,0,0,5,11a2.35,2.35,0,0,0,.61,1.76A2.4,2.4,0,0,0,7.34,13.38Zm13.35,1.8a1,1,0,0,1-.64-.16,1.3,1.3,0,0,1-.35-.65L15.81,1.51a3,3,0,0,1-.15-.67.36.36,0,0,1,.41-.41H17.7a1,1,0,0,1,.65.16,1.4,1.4,0,0,1,.33.65l2.79,11,2.59-11A1.17,1.17,0,0,1,24.39.6a1.1,1.1,0,0,1,.67-.16H26.4a1.1,1.1,0,0,1,.67.16,1.17,1.17,0,0,1,.32.65L30,12.39,32.88,1.25A1.39,1.39,0,0,1,33.22.6a1,1,0,0,1,.65-.16h1.54a.36.36,0,0,1,.41.41,1.36,1.36,0,0,1,0,.26,3.64,3.64,0,0,1-.12.41l-4,12.86a1.3,1.3,0,0,1-.35.65,1,1,0,0,1-.64.16H29.25a1,1,0,0,1-.67-.17,1.26,1.26,0,0,1-.32-.67L25.67,3.64,23.11,14.34a1.26,1.26,0,0,1-.32.67,1,1,0,0,1-.67.17Zm21.36.44a11.28,11.28,0,0,1-2.56-.29,7.44,7.44,0,0,1-1.92-.67,1,1,0,0,1-.61-.93v-.84q0-.52.38-.52a.9.9,0,0,1,.31.06l.42.17a8.77,8.77,0,0,0,1.83.58,9.78,9.78,0,0,0,2,.2,4.48,4.48,0,0,0,2.43-.55,1.76,1.76,0,0,0,.86-1.57,1.61,1.61,0,0,0-.45-1.16A4.29,4.29,0,0,0,43,9.22l-2.41-.76A5.15,5.15,0,0,1,38,6.78a3.94,3.94,0,0,1-.83-2.41,3.7,3.7,0,0,1,.45-1.85,4.47,4.47,0,0,1,1.19-1.37A5.27,5.27,0,0,1,40.51.29,7.4,7.4,0,0,1,42.6,0a8.87,8.87,0,0,1,1.12.07q.57.07,1.08.19t.95.26a4.27,4.27,0,0,1,.7.29,1.59,1.59,0,0,1,.49.41.94.94,0,0,1,.15.55v.79q0,.52-.38.52a1.76,1.76,0,0,1-.64-.2,7.74,7.74,0,0,0-3.2-.64,4.37,4.37,0,0,0-2.21.47,1.6,1.6,0,0,0-.79,1.48,1.58,1.58,0,0,0,.49,1.18,4.94,4.94,0,0,0,1.83.92L44.55,7a5.08,5.08,0,0,1,2.57,1.6A3.76,3.76,0,0,1,47.9,11a4.21,4.21,0,0,1-.44,1.93,4.4,4.4,0,0,1-1.21,1.47,5.43,5.43,0,0,1-1.85.93A8.25,8.25,0,0,1,42.05,15.62Z"></path><path class="cls-1" d="M45.19,23.81C39.72,27.85,31.78,30,25,30A36.64,36.64,0,0,1,.22,20.57c-.51-.46-.06-1.09.56-.74A49.78,49.78,0,0,0,25.53,26.4,49.23,49.23,0,0,0,44.4,22.53C45.32,22.14,46.1,23.14,45.19,23.81Z"></path><path class="cls-1" d="M47.47,21.21c-.7-.9-4.63-.42-6.39-.21-.53.06-.62-.4-.14-.74,3.13-2.2,8.27-1.57,8.86-.83s-.16,5.89-3.09,8.35c-.45.38-.88.18-.68-.32C46.69,25.8,48.17,22.11,47.47,21.21Z"></path></svg></div><div><h3>AWS Toolkit for VSCode</h3><h1>Welcome &amp; Getting Started</h1></div></div><h1>Select a feature to get started</h1>',2),o={class:"service-item-list"},a=(0,e.createElementVNode)("h3",null,"ENABLE ADDITIONAL FEATURES",-1),_={class:"service-item-list"},c=(0,e.createElementVNode)("h3",null,null,-1),p={key:0,id:"right-column"};function l(t,i,v,E,S,B){const T=(0,e.resolveComponent)("ServiceItem");return(0,e.openBlock)(),(0,e.createElementBlock)("div",r,[(0,e.createElementVNode)("div",n,[(0,e.createElementVNode)("div",null,[s,((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.unlockedItemIds,m=>((0,e.openBlock)(),(0,e.createElementBlock)("ul",o,[((0,e.openBlock)(),(0,e.createBlock)(T,{title:t.getServiceItemProps(m).title,description:t.getServiceItemProps(m).description,status:"UNLOCKED",isSelected:t.isServiceSelected(m),isLandscape:t.isLandscape,id:m,key:t.buildServiceItemKey(m,"UNLOCKED"),onServiceItemClicked:j=>t.serviceWasSelected(m)},(0,e.createSlots)({_:2},[t.isServiceSelected(m)&&!t.isLandscape?{name:"service-item-content-slot",fn:(0,e.withCtx)(()=>[((0,e.openBlock)(),(0,e.createBlock)((0,e.resolveDynamicComponent)(t.getServiceItemContent(m)),{state:t.serviceItemsAuthStatus[m],key:m+t.rerenderContentWindowKey,onIsAuthConnected:t.onIsAuthConnected},null,8,["state","onIsAuthConnected"]))])}:void 0]),1032,["title","description","isSelected","isLandscape","id","onServiceItemClicked"]))]))),256))]),(0,e.createElementVNode)("div",null,[a,((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.lockedItemIds,m=>((0,e.openBlock)(),(0,e.createElementBlock)("ul",_,[((0,e.openBlock)(),(0,e.createBlock)(T,{title:t.getServiceItemProps(m).title,description:t.getServiceItemProps(m).description,status:"LOCKED",isSelected:t.isServiceSelected(m),isLandscape:t.isLandscape,id:m,key:t.buildServiceItemKey(m,"LOCKED"),onServiceItemClicked:j=>t.serviceWasSelected(m)},(0,e.createSlots)({_:2},[t.isServiceSelected(m)&&!t.isLandscape?{name:"service-item-content-slot",fn:(0,e.withCtx)(()=>[((0,e.openBlock)(),(0,e.createBlock)((0,e.resolveDynamicComponent)(t.getServiceItemContent(m)),{state:t.serviceItemsAuthStatus[m],key:m+t.rerenderContentWindowKey,onIsAuthConnected:t.onIsAuthConnected},null,8,["state","onIsAuthConnected"]))])}:void 0]),1032,["title","description","isSelected","isLandscape","id","onServiceItemClicked"]))]))),256))]),c]),t.isLandscape&&t.isAnyServiceSelected?((0,e.openBlock)(),(0,e.createElementBlock)("div",p,[((0,e.openBlock)(),(0,e.createBlock)((0,e.resolveDynamicComponent)(t.getServiceItemContent(t.getSelectedService())),{state:t.serviceItemsAuthStatus[t.getSelectedService()],key:t.getSelectedService()+t.rerenderContentWindowKey,onIsAuthConnected:t.onIsAuthConnected},null,8,["state","onIsAuthConnected"]))])):(0,e.createCommentVNode)("v-if",!0)])}const y={class:"text-info-container"},L={class:"service-item-title"},R={class:"service-item-description"},C={class:"service-item-content-list-item"};function J(t,i,v,E,S,B){return(0,e.openBlock)(),(0,e.createElementBlock)(e.Fragment,null,[(0,e.createElementVNode)("li",{class:(0,e.normalizeClass)([t.classWhenIsSelected,"service-item-container","border-common"]),onMousedown:i[0]||(i[0]=(...T)=>t.serviceItemClicked&&t.serviceItemClicked(...T))},[(0,e.createCommentVNode)(" The icon "),(0,e.createElementVNode)("div",{class:(0,e.normalizeClass)(["icon-item",t.serviceIconClass])},null,2),(0,e.createCommentVNode)(" The text info "),(0,e.createElementVNode)("div",y,[(0,e.createElementVNode)("div",L,(0,e.toDisplayString)(t.title),1),(0,e.createElementVNode)("div",R,(0,e.toDisplayString)(t.description),1)])],34),(0,e.createElementVNode)("li",C,[(0,e.createCommentVNode)(" See 'Named Slots' for more info "),(0,e.renderSlot)(t.$slots,"service-item-content-slot")])],64)}const H={LOCKED:"icon icon-lg icon-vscode-lock",LOCKED_SELECTED:"icon icon-lg icon-vscode-lock locked-selected",UNLOCKED:"icon icon-lg icon-vscode-check unlocked"},X=(0,e.defineComponent)({name:"ServiceItem",components:{},emits:["service-item-clicked"],props:{id:{type:String,required:!0},title:{type:String,required:!0},description:{type:String,required:!0},status:{type:String,default:"LOCKED"},isSelected:{type:Boolean,default:!1},isLandscape:{type:Boolean,required:!0,description:"Whether the screen is in landscape mode or not."}},data(){return{classWhenIsSelected:"",serviceIconClasses:H,serviceIconClass:""}},created(){this.classWhenIsSelected=this.isSelected?"service-item-container-selected":"";const t=this.isSelected&&this.status==="LOCKED"?"LOCKED_SELECTED":this.status;this.serviceIconClass=this.serviceIconClasses[t]},methods:{serviceItemClicked(){this.$emit("service-item-clicked",this.id)}}}),D={NON_AUTH_FEATURES:"NON_AUTH_FEATURES",RESOURCE_EXPLORER:"RESOURCE_EXPLORER",CODE_WHISPERER:"CODE_WHISPERER",CODE_CATALYST:"CODE_CATALYST"},z={[D.NON_AUTH_FEATURES]:{title:"Debug Lambda Functions & Edit AWS Document Types",description:"Local features that don't require authentication."},[D.RESOURCE_EXPLORER]:{title:"Resource Explorer",description:"View, modify, deploy, and troubleshoot AWS resources."},[D.CODE_WHISPERER]:{title:"Amazon CodeWhisperer",description:"Build applications faster with AI code recommendations."},[D.CODE_CATALYST]:{title:"Amazon CodeCatalyst",description:"Spark a faster planning, development, and delivery lifecycle on AWS."}};class Y{constructor(){this.unlockedServices=new Set([D.NON_AUTH_FEATURES]),this.currentlySelected=D.NON_AUTH_FEATURES}getServiceIds(){const i=Object.keys(z),v=i.filter(S=>this.unlockedServices.has(S)),E=i.filter(S=>!this.unlockedServices.has(S));return{unlocked:v,locked:E}}getStaticServiceItemProps(i){return z[i]}get selected(){return this.currentlySelected}select(i){this.currentlySelected=i}deselect(){this.currentlySelected=void 0}toggleSelected(i){this.currentlySelected===i?this.deselect():this.select(i)}unlock(i){this.unlockedServices.add(i)}lock(i){this.unlockedServices.delete(i)}}var te=g(803),d=g(744);const A=(0,d.Z)(X,[["render",J]]),h={class:"service-item-content-container border-common"};function u(t,i,v,E,S,B){const T=(0,e.resolveComponent)("CredentialsForm");return(0,e.openBlock)(),(0,e.createElementBlock)("div",h,[(0,e.createElementVNode)("div",null,[(0,e.createVNode)(T,{state:t.credentialsFormState,onAuthConnectionUpdated:t.onAuthConnectionUpdated},null,8,["state","onAuthConnectionUpdated"])])])}const w={class:"auth-form container-background border-common",id:"credentials-form"},I=(0,e.createTextVNode)("IAM Credentials"),k=(0,e.createElementVNode)("div",null,"Add another profile",-1),b={key:1},U=(0,e.createElementVNode)("div",{class:"form-section"},[(0,e.createElementVNode)("label",{class:"small-description"},"Credentials will be added to the appropriate `~/.aws/` files."),(0,e.createElementVNode)("div",null,[(0,e.createElementVNode)("div",{class:"icon icon-vscode-edit edit-icon"}),(0,e.createTextVNode)(" Edit file directly ")])],-1),O={class:"form-section"},F=(0,e.createElementVNode)("label",{class:"input-title"},"Profile Name",-1),ce=(0,e.createElementVNode)("label",{class:"small-description"},"The identifier for these credentials",-1),le=["data-invalid"],_e={class:"small-description error-text"},ue={class:"form-section"},me=(0,e.createElementVNode)("label",{class:"input-title"},"Access Key",-1),pe=(0,e.createElementVNode)("label",{class:"small-description"},"The access key",-1),he=["data-invalid"],ve={class:"small-description error-text"},Ae={class:"form-section"},fe=(0,e.createElementVNode)("label",{class:"input-title"},"Secret Key",-1),Ce=(0,e.createElementVNode)("label",{class:"small-description"},"The secret key",-1),Ee=["data-invalid"],Ie={class:"small-description error-text"},Se={class:"form-section"},ge=["disabled"],ye={class:"small-description error-text"};function Be(t,i,v,E,S,B){const T=(0,e.resolveComponent)("FormTitle");return(0,e.withDirectives)(((0,e.openBlock)(),(0,e.createElementBlock)("div",w,[(0,e.createVNode)(T,{isConnected:t.isConnected},{default:(0,e.withCtx)(()=>[I]),_:1},8,["isConnected"]),t.isConnected?((0,e.openBlock)(),(0,e.createElementBlock)("div",{key:0,class:"form-section",onClick:i[0]||(i[0]=m=>t.toggleShowForm()),id:"collapsible"},[(0,e.createElementVNode)("div",{class:(0,e.normalizeClass)(t.collapsibleClass)},null,2),k])):(0,e.createCommentVNode)("v-if",!0),t.isFormShown?((0,e.openBlock)(),(0,e.createElementBlock)("div",b,[U,(0,e.createElementVNode)("div",O,[F,ce,(0,e.withDirectives)((0,e.createElementVNode)("input",{"onUpdate:modelValue":i[1]||(i[1]=m=>t.data.profileName=m),type:"text","data-invalid":!!t.errors.profileName},null,8,le),[[e.vModelText,t.data.profileName]]),(0,e.createElementVNode)("div",_e,(0,e.toDisplayString)(t.errors.profileName),1)]),(0,e.createElementVNode)("div",ue,[me,pe,(0,e.withDirectives)((0,e.createElementVNode)("input",{"onUpdate:modelValue":i[2]||(i[2]=m=>t.data.aws_access_key_id=m),"data-invalid":!!t.errors.aws_access_key_id,type:"text"},null,8,he),[[e.vModelText,t.data.aws_access_key_id]]),(0,e.createElementVNode)("div",ve,(0,e.toDisplayString)(t.errors.aws_access_key_id),1)]),(0,e.createElementVNode)("div",Ae,[fe,Ce,(0,e.withDirectives)((0,e.createElementVNode)("input",{"onUpdate:modelValue":i[3]||(i[3]=m=>t.data.aws_secret_access_key=m),type:"password","data-invalid":!!t.errors.aws_secret_access_key},null,8,Ee),[[e.vModelText,t.data.aws_secret_access_key]]),(0,e.createElementVNode)("div",Ie,(0,e.toDisplayString)(t.errors.aws_secret_access_key),1)]),(0,e.createElementVNode)("div",Se,[(0,e.createElementVNode)("button",{disabled:!t.canSubmit,onClick:i[4]||(i[4]=m=>t.submitData())},"Add Profile",8,ge),(0,e.createElementVNode)("div",ye,(0,e.toDisplayString)(t.errors.submit),1)])])):(0,e.createCommentVNode)("v-if",!0)],512)),[[e.vShow,t.canShowAll]])}const De=(0,e.defineComponent)({emits:["auth-connection-updated"],methods:{emitAuthConnectionUpdated(t){this.$emit("auth-connection-updated",t)}}});class Te{isAuthConnected(){return Promise.resolve(!1)}}const ne=De,we={key:0,style:{display:"flex"}},Oe=(0,e.createElementVNode)("div",{class:"pass-icon icon icon-lg icon-vscode-pass-filled"},null,-1),be={class:"auth-form-title"},Re=(0,e.createTextVNode)("Connected to "),Pe={key:1},Le={class:"auth-form-title"};function ke(t,i,v,E,S,B){return t.isConnected?((0,e.openBlock)(),(0,e.createElementBlock)("div",we,[Oe,(0,e.createElementVNode)("label",be,[Re,(0,e.renderSlot)(t.$slots,"default")])])):((0,e.openBlock)(),(0,e.createElementBlock)("div",Pe,[(0,e.createElementVNode)("label",Le,[(0,e.renderSlot)(t.$slots,"default")])]))}const We=(0,e.defineComponent)({props:{isConnected:{type:Boolean,required:!0}}});var yt=g(423);const se=(0,d.Z)(We,[["render",ke]]);/*!
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */class N{static registerGlobalCommands(){const i=new Event("remount");window.addEventListener("message",v=>{const{command:E}=v.data;E==="$clear"&&(vscode.setState({}),this.messageListeners.forEach(S=>this.removeListener(S)),window.dispatchEvent(i))})}static addListener(i){this.messageListeners.add(i),window.addEventListener("message",i)}static removeListener(i){this.messageListeners.delete(i),window.removeEventListener("message",i)}static sendRequest(i,v,E){const S=JSON.parse(JSON.stringify(E)),B=new Promise((T,m)=>{const j=It=>{const $=It.data;if(i===$.id)if(this.removeListener(j),window.clearTimeout(Et),$.error===!0){const St=JSON.parse($.data);m(new Error(St.message))}else $.event?(typeof E[0]!="function"&&m(new Error(`Expected frontend event handler to be a function: ${v}`)),T(this.registerEventHandler(v,E[0]))):T($.data)},Et=setTimeout(()=>{this.removeListener(j),m(new Error(`Timed out while waiting for response: id: ${i}, command: ${v}`))},3e5);this.addListener(j)});return vscode.postMessage({id:i,command:v,data:S}),B}static registerEventHandler(i,v){const E=S=>{const B=S.data;if(B.command===i){if(!B.event)throw new Error(`Expected backend handler to be an event emitter: ${i}`);v(B.data)}};return this.addListener(E),{dispose:()=>this.removeListener(E)}}static create(){return this.initialized||(this.initialized=!0,this.registerGlobalCommands()),new Proxy({},{set:()=>{throw new TypeError("Cannot set property to webview client")},get:(i,v)=>{var E;if(typeof v!="string"){console.warn(`Tried to index webview client with non-string property: ${String(v)}`);return}if(v==="init"){const B=(E=vscode.getState())!=null?E:{};if(B.__once)return()=>Promise.resolve();vscode.setState(Object.assign(B,{__once:!0}))}const S=(this.counter++).toString();return(...B)=>this.sendRequest(S,v,B)}})}}N.counter=0,N.initialized=!1,N.messageListeners=new Set;const W=N.create(),Ne=(0,e.defineComponent)({name:"CredentialsForm",extends:ne,components:{FormTitle:se},props:{state:{type:Object,required:!0}},data(){return{data:{profileName:this.state.getValue("profileName"),aws_access_key_id:this.state.getValue("aws_access_key_id"),aws_secret_access_key:this.state.getValue("aws_secret_access_key")},errors:{profileName:"",aws_access_key_id:"",aws_secret_access_key:"",submit:""},canSubmit:!1,isConnected:!1,isFormShown:!1,canShowAll:!1}},async created(){await this.updateDataError("profileName"),await this.updateDataError("aws_access_key_id"),await this.updateDataError("aws_secret_access_key"),await Promise.all([this.updateConnectedStatus(),this.updateSubmittableStatus()]),this.isFormShown=!this.isConnected,this.canShowAll=!0},computed:{collapsibleClass(){return this.isFormShown?"icon icon-vscode-chevron-down":"icon icon-vscode-chevron-right"}},methods:{setNewValue(t,i){this.errors.submit="",this.state.setValue(t,i.trim()),this.updateSubmittableStatus(),this.updateDataError(t)},async updateDataError(t){return this.state.getFormatError(t).then(i=>{this.errors[t]=i!=null?i:""})},async updateSubmittableStatus(){return this.state.getSubmissionErrors().then(t=>{this.canSubmit=t===void 0})},async updateConnectedStatus(){return this.state.isAuthConnected().then(t=>{this.isConnected=t,this.emitAuthConnectionUpdated("CREDENTIALS")})},async submitData(){this.canSubmit=!1,this.errors.submit="",this.errors.submit=await this.state.getAuthenticationError(),!this.errors.submit&&(await this.state.submitData(),this.clearFormData(),this.isFormShown=!1,this.canSubmit=!0,await this.updateConnectedStatus())},toggleShowForm(){this.isFormShown=!this.isFormShown},clearFormData(){this.data.profileName="",this.data.aws_access_key_id="",this.data.aws_secret_access_key=""}},watch:{"data.profileName"(t){this.setNewValue("profileName",t)},"data.aws_access_key_id"(t){this.setNewValue("aws_access_key_id",t)},"data.aws_secret_access_key"(t){this.setNewValue("aws_secret_access_key",t)}}});class Me{constructor(i){this._data={profileName:"",aws_access_key_id:"",aws_secret_access_key:"",...i}}setValue(i,v){this._data[i]=v}getValue(i){return this._data[i]}async isAuthConnected(){return await W.isCredentialConnected()}async getFormatError(i){return i==="profileName"?W.getProfileNameError(this._data.profileName,!1):await W.getCredentialFormatError(i,this._data[i])}async getSubmissionErrors(){const i=await W.getProfileNameError(this._data.profileName),v=await W.getCredentialsSubmissionErrors(this._data);if(!(!i&&!v))return{profileName:i,...v}}async getAuthenticationError(){const i=await W.getAuthenticatedCredentialsError(this._data);return i?i.error:""}async submitData(){const i=await this.getSubmittableDataOrThrow();return W.trySubmitCredentials(i.profileName,i)}async getSubmittableDataOrThrow(){const i=await this.getSubmissionErrors();if(i!==void 0)throw new Error(`authWebview: data should be valid at this point, but is invalid: ${i}`);return this._data}}var Dt=g(510);const xe=(0,d.Z)(Ne,[["render",Be]]),Ue={class:"service-item-content-container border-common"};function Fe(t,i,v,E,S,B){return(0,e.openBlock)(),(0,e.createElementBlock)("div",Ue,"Must Be Implemented")}const Ke=(0,e.defineComponent)({name:"BaseServiceItemContent",emits:["is-auth-connected"],props:{state:{type:Object,required:!0}},methods:{emitIsAuthConnected(t,i){this.$emit("is-auth-connected",t,i)}}});var wt=g(446);const G=(0,d.Z)(Ke,[["render",Fe]]),Ve={class:"auth-form container-background border-common",id:"builder-id-form"},je=(0,e.createTextVNode)("AWS Builder ID"),$e={key:0},Ze=(0,e.createElementVNode)("div",{class:"form-section"},[(0,e.createElementVNode)("div",null,[(0,e.createTextVNode)(" With AWS Builder ID, sign in for free without an AWS account. "),(0,e.createElementVNode)("a",{href:"https://docs.aws.amazon.com/signin/latest/userguide/sign-in-aws_builder_id.html"},"Read more.")])],-1),He={class:"form-section"},Xe={key:1},ze=[(0,e.createElementVNode)("div",{class:"form-section"},[(0,e.createElementVNode)("div",null,"Follow instructions...")],-1)],Ye={key:2},Ge={class:"form-section"};function Je(t,i,v,E,S,B){const T=(0,e.resolveComponent)("FormTitle");return(0,e.openBlock)(),(0,e.createElementBlock)("div",Ve,[(0,e.withDirectives)((0,e.createElementVNode)("div",null,[(0,e.createVNode)(T,{isConnected:t.isConnected},{default:(0,e.withCtx)(()=>[je]),_:1},8,["isConnected"]),t.stage===t.stages.START?((0,e.openBlock)(),(0,e.createElementBlock)("div",$e,[Ze,(0,e.createElementVNode)("div",He,[(0,e.createElementVNode)("button",{onClick:i[0]||(i[0]=m=>t.startSignIn())},"Sign up or Sign in")])])):(0,e.createCommentVNode)("v-if",!0),t.stage===t.stages.WAITING_ON_USER?((0,e.openBlock)(),(0,e.createElementBlock)("div",Xe,ze)):(0,e.createCommentVNode)("v-if",!0),t.stage===t.stages.CONNECTED?((0,e.openBlock)(),(0,e.createElementBlock)("div",Ye,[(0,e.createElementVNode)("div",Ge,[(0,e.createElementVNode)("div",{onClick:i[1]||(i[1]=m=>t.signout()),style:{cursor:"pointer",color:"#75beff"}},"Sign out")])])):(0,e.createCommentVNode)("v-if",!0)],512),[[e.vShow,t.canShowAll]])])}const K={CREDENTIALS:"CREDENTIALS",BUILDER_ID_CODE_WHISPERER:"BUILDER_ID_CODE_WHISPERER",BUILDER_ID_CODE_CATALYST:"BUILDER_ID_CODE_CATALYST"},V=N.create(),M={START:"START",WAITING_ON_USER:"WAITING_ON_USER",CONNECTED:"CONNECTED"},Qe=(0,e.defineComponent)({name:"CredentialsForm",extends:ne,components:{FormTitle:se},props:{state:{type:Object,required:!0},stages:{type:Object,default:M}},data(){return{stage:M.START,isConnected:!1,builderIdCode:"",canShowAll:!1}},async created(){await this.update(),this.canShowAll=!0},methods:{async startSignIn(){this.stage=this.stages.WAITING_ON_USER,await this.state.startBuilderIdSetup(),await this.update()},async update(){this.stage=await this.state.stage(),this.isConnected=await this.state.isAuthConnected(),this.emitAuthConnectionUpdated(this.state.id)},async signout(){await this.state.signout(),this.update()}}});class ie{constructor(){this._stage=M.START}async startBuilderIdSetup(){return this._stage=M.WAITING_ON_USER,this._startBuilderIdSetup()}async stage(){const i=await this.isAuthConnected();return this._stage=i?M.CONNECTED:M.START,this._stage}async signout(){await V.signoutBuilderId()}}class qe extends ie{get id(){return K.BUILDER_ID_CODE_WHISPERER}isAuthConnected(){return V.isCodeWhispererBuilderIdConnected()}_startBuilderIdSetup(){return V.startCodeWhispererBuilderIdSetup()}}class et extends ie{get id(){return K.BUILDER_ID_CODE_CATALYST}isAuthConnected(){return V.isCodeCatalystBuilderIdConnected()}_startBuilderIdSetup(){return V.startCodeCatalystBuilderIdSetup()}}var kt=g(536);const oe=(0,d.Z)(Qe,[["render",Je]]),x={[K.CREDENTIALS]:new Me,[K.BUILDER_ID_CODE_WHISPERER]:new qe,[K.BUILDER_ID_CODE_CATALYST]:new et},tt=(0,e.defineComponent)({name:"AwsExplorerContent",components:{CredentialsForm:xe},extends:G,computed:{credentialsFormState(){return x.CREDENTIALS}},methods:{async onAuthConnectionUpdated(){const t=await this.state.isAuthConnected();this.emitIsAuthConnected("RESOURCE_EXPLORER",t)}}});class nt{async isAuthConnected(){return x.CREDENTIALS.isAuthConnected()}}var Ut=g(824);const st=(0,d.Z)(tt,[["render",u]]),it={class:"service-item-content-container border-common"};function ot(t,i,v,E,S,B){const T=(0,e.resolveComponent)("BuilderIdForm");return(0,e.openBlock)(),(0,e.createElementBlock)("div",it,[(0,e.createElementVNode)("div",null,[(0,e.createVNode)(T,{state:t.builderIdState,onAuthConnectionUpdated:t.onAuthConnectionUpdated},null,8,["state","onAuthConnectionUpdated"])])])}const rt=(0,e.defineComponent)({name:"CodeWhispererContent",components:{BuilderIdForm:oe},extends:G,computed:{builderIdState(){return x.BUILDER_ID_CODE_WHISPERER}},methods:{async onAuthConnectionUpdated(){const t=await this.state.isAuthConnected();this.emitIsAuthConnected("CODE_WHISPERER",t)}}});class at{async isAuthConnected(){return x.BUILDER_ID_CODE_WHISPERER.isAuthConnected()}}var Kt=g(743);const dt=(0,d.Z)(rt,[["render",ot]]),ct={class:"service-item-content-container border-common"};function lt(t,i,v,E,S,B){const T=(0,e.resolveComponent)("BuilderIdForm");return(0,e.openBlock)(),(0,e.createElementBlock)("div",ct,[(0,e.createElementVNode)("div",null,[(0,e.createVNode)(T,{state:t.builderIdState,onAuthConnectionUpdated:t.onAuthConnectionUpdated},null,8,["state","onAuthConnectionUpdated"])])])}const _t=(0,e.defineComponent)({name:"CodeCatalystContent",components:{BuilderIdForm:oe},extends:G,computed:{builderIdState(){return x.BUILDER_ID_CODE_CATALYST}},methods:{async onAuthConnectionUpdated(){const t=await this.state.isAuthConnected();this.emitIsAuthConnected("CODE_CATALYST",t)}}});class ut{async isAuthConnected(){return x.BUILDER_ID_CODE_CATALYST.isAuthConnected()}}var jt=g(437);const mt=(0,d.Z)(_t,[["render",lt]]),pt={[D.NON_AUTH_FEATURES]:G,[D.RESOURCE_EXPLORER]:st,[D.CODE_CATALYST]:mt,[D.CODE_WHISPERER]:dt},ht={[D.NON_AUTH_FEATURES]:new Te,[D.RESOURCE_EXPLORER]:new nt,[D.CODE_CATALYST]:new ut,[D.CODE_WHISPERER]:new at},vt=pt,At=N.create(),P=new Y,ft=(0,e.defineComponent)({components:{ServiceItem:A},name:"AuthRoot",data(){return{unlockedItemIds:[],lockedItemIds:[],currWindowWidth:window.innerWidth,serviceItemsAuthStatus:ht,rerenderContentWindowKey:0}},async created(){await this.updateServiceConnections(),At.onDidConnectionUpdate(()=>{this.updateServiceConnections(),this.rerenderSelectedContentWindow()})},mounted(){window.addEventListener("resize",this.updateWindowWidth)},unmounted(){window.removeEventListener("resize",this.updateWindowWidth)},computed:{isLandscape(){return this.currWindowWidth>1300},isAnyServiceSelected(){return P.selected!==void 0}},methods:{renderItems(){const{unlocked:t,locked:i}=P.getServiceIds();this.unlockedItemIds=t,this.lockedItemIds=i},isServiceSelected(t){return P.selected===t},getSelectedService(){return P.selected},getServiceItemProps(t){return P.getStaticServiceItemProps(t)},serviceWasSelected(t){P.select(t),this.renderItems()},buildServiceItemKey(t,i){return t+"_"+(this.isServiceSelected(t)?`${i}_SELECTED`:`${i}`)},updateWindowWidth(){this.currWindowWidth=window.innerWidth},getServiceItemContent(t){return vt[t]},updateServiceLock(t,i){i?P.unlock(t):P.lock(t)},onIsAuthConnected(t,i){this.updateServiceLock(t,i),this.renderItems(),this.updateServiceConnections()},async updateServiceConnections(){return Promise.all([this.serviceItemsAuthStatus.RESOURCE_EXPLORER.isAuthConnected().then(t=>{this.updateServiceLock("RESOURCE_EXPLORER",t)}),this.serviceItemsAuthStatus.CODE_WHISPERER.isAuthConnected().then(t=>{this.updateServiceLock("CODE_WHISPERER",t)}),this.serviceItemsAuthStatus.CODE_CATALYST.isAuthConnected().then(t=>{this.updateServiceLock("CODE_CATALYST",t)})]).then(()=>this.renderItems())},rerenderSelectedContentWindow(){this.rerenderContentWindowKey=this.rerenderContentWindowKey===0?1:0}}});var Xt=g(414);const Ct=(0,d.Z)(ft,[["render",l]]);/*!
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 *
 * This module is run within the webview, and will mount the Vue app.
 */const re=()=>(0,e.createApp)(Ct),ae=re();ae.mount("#vue-app"),window.addEventListener("remount",()=>{ae.unmount(),re().mount("#vue-app")})})();var q=this;for(var ee in Z)q[ee]=Z[ee];Z.__esModule&&Object.defineProperty(q,"__esModule",{value:!0})})();

//# sourceMappingURL=index.js.map