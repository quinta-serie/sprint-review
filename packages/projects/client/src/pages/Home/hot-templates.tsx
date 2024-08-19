import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import MuiFormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import FormHelperText from '@mui/material/FormHelperText';

import { truthsAndLies } from '@/services/board';
import { userServices } from '@/services/core';
import type { TeamPopulated } from '@/services/team';
import Form, { Control, FormControl, useForm } from '@/components/Form';

import useTeams from '../Teams/useTeams';

export type HotTamplateName = 'Standard' | 'TruthsAndLies'

interface HotTemplateForm {
    teamId: string;
}

interface HotTemplateProps { onClose: () => void }

export function TruthsAndLies({ onClose }: HotTemplateProps) {
    const { myTeams, addTeamBoard } = useTeams();

    const { user_id } = userServices.current;

    const [formGroup] = useForm<HotTemplateForm>({
        form: {
            teamId: new FormControl({ value: '', required: true })
        },
        handle: {
            submit: async (form) => {
                const { teamId } = form.values;
                const currentTeam = myTeams.find(team => team.id === teamId) as TeamPopulated;

                addTeamBoard(teamId, truthsAndLies({
                    teamId,
                    ownerId: user_id,
                    members: currentTeam.members.map(m => m.name)
                }));
            }
        }
    }, [myTeams]);

    return (
        <DialogContent>
            <Form formGroup={formGroup}>
                <MuiFormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Selecione um time</InputLabel>
                    <Control controlName="teamId" action="onChange">
                        <Select
                            label="Selecione um time"
                            value={formGroup.controls.teamId.value}
                            error={formGroup.controls.teamId.isInvalid}
                        >
                            {
                                myTeams.map(team => (
                                    <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </Control>
                    {
                        formGroup.controls.teamId.isInvalid && (
                            <FormHelperText error>{formGroup.controls.teamId.error}</FormHelperText>
                        )
                    }
                </MuiFormControl>
                <DialogActions sx={{ mt: 2 }}>
                    <Button color="inherit" variant="outlined" onClick={onClose}>Fechar</Button>
                    <Button type="submit" color="primary" variant="contained">Criar</Button>
                </DialogActions>
            </Form>
            {/* <DialogContentText> */}
            {/* eslint-disable */}
            {/* <p>AAAAAAAAAA</p>
                    <div>
                        <strong>Objetivo:</strong> Esse template é utilizado para dinâmicas de <strong>team building</strong>.
                        <br />
                        Conheça seus colegas de equipe e descubra mais sobre eles.
                        <ol style={{ listStyleType: 'upper-roman' }}>
                            <li>Cada membro da equipe deve escrever 2 fatos sobre si mesmo e uma mentira em cartões separados.</li>
                            <li>Em seguida, cada membro da equipe deve compartilhar seus cartões com o grupo.</li>
                            <li>Vamos gerar um card com uma legenda identificando cada membro da equipe.</li>
                            <li>O grupo deve adicionar reações aos cards de acordo com a legenda, tentando identificar qual colega escreveu aquele card.</li>
                            <li>Depois disso o dono do board deve desabilitar a opção "Ocultar autor do card", mostrando assim se o time conseguiu adivinhar corretamente o autor</li>
                            <li>Em seguida o grupo deve arrastar os cards para as colunas de verdade ou mentira</li>
                            <li>Após os membros do grupo terem conversado sobre a, cada membro deve revelar a mentira.</li>
                        </ol>
                    </div> */}
            {/* eslint-enable */}
            {/* </DialogContentText> */}
        </DialogContent>
    );
}

export function Standard({ onClose }: HotTemplateProps) {
    return (
        <DialogContent>
            <DialogContentText>
                Standard
            </DialogContentText>
            <DialogActions>
                <Button color="secondary" variant="outlined" onClick={onClose}>Fechar</Button>
                <Button color="secondary" variant="contained" onClick={onClose}>Fechar</Button>
            </DialogActions>
        </DialogContent>
    );
}

export default {
    Standard,
    TruthsAndLies,
} as { [x in HotTamplateName]: (props: HotTemplateProps) => JSX.Element };