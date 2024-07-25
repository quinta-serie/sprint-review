import { useState } from 'react';

import Box from '@mui/material/Box';
import Zoom from '@mui/material/Zoom';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MuiFormGroup from '@mui/material/FormGroup';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import AddIcon from '@mui/icons-material/Add';

import Form, { Control, FormGroup } from '@/components/Form';

import type { TemplateFormData } from './interface';

function InputColumns({ formGroup }: { formGroup: FormGroup<TemplateFormData> }) {
    const [input, setInput] = useState('');

    const addColumn = () => { formGroup.setValues({ columns: [...formGroup.controls.columns.value, input] }); };

    const updateInput = (e: React.FormEvent<HTMLDivElement>) => { setInput(e.target['value']); };

    const handleDeleteColumn = (index: number) => {
        const columns = formGroup.controls.columns.value.filter((_, i) => i !== index);

        formGroup.setValues({ columns });

        setInput('');
    };

    return (
        <Box>
            <Typography variant="subtitle2" gutterBottom>Colunas</Typography>
            <OutlinedInput
                fullWidth
                size="small"
                value={input}
                placeholder="Ex: To Do, In Progress, Done"
                onInput={updateInput}
                sx={{ marginBottom: 2 }}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton edge="end" onClick={addColumn}>
                            <AddIcon />
                        </IconButton>
                    </InputAdornment>
                }
            />
            <Box>
                {
                    formGroup.controls.columns.value.map((column, index) => (
                        <Zoom in key={index}>
                            <Chip
                                label={column}
                                variant="outlined"
                                sx={{ mr: 2, mb: 2 }}
                                avatar={<Avatar>{index + 1}</Avatar>}
                                onDelete={() => handleDeleteColumn(index)}
                            />
                        </Zoom>
                    ))
                }
                {
                    formGroup.controls.columns.isInvalid && (
                        <Typography variant="subtitle2" color="error">
                            {formGroup.controls.columns.error}
                        </Typography>
                    )
                }
            </Box>
        </Box>
    );
}

interface TemplateFormProps {
    shouldOmitName?: boolean;
    shouldOmitColumns?: boolean;
    children?: React.JSX.Element;
    formGroup: FormGroup<TemplateFormData>;
}
export default function TemplateForm({
    children,
    formGroup,
    shouldOmitName = false,
    shouldOmitColumns = false
}: TemplateFormProps) {
    return (
        <Form formGroup={formGroup}>
            <Stack spacing={2}>
                {
                    !shouldOmitName && <Box>
                        <Typography variant="subtitle2" gutterBottom>Nome do Board</Typography>
                        <Control controlName="name">
                            <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                placeholder="Ex: Retrospectiva"
                                value={formGroup.controls.name.value}
                                error={formGroup.controls.name.isInvalid}
                                helperText={formGroup.controls.name.isInvalid && formGroup.controls.name.error}
                            />
                        </Control>
                    </Box>
                }
                <Box>
                    <Typography variant="subtitle2" gutterBottom>Votos por pessoa</Typography>
                    <Control controlName="maxVotesPerUser" action="onChange">
                        <Slider
                            marks
                            min={1}
                            max={10}
                            shiftStep={1}
                            defaultValue={formGroup.controls.maxVotesPerUser.value}
                            valueLabelDisplay="auto"
                        />
                    </Control>
                </Box>
                <Box>
                    <Typography variant="subtitle2" gutterBottom>Votos por Card</Typography>
                    <Control controlName="maxVotesPerCard" action="onChange">
                        <Slider
                            marks
                            min={1}
                            max={10}
                            shiftStep={1}
                            defaultValue={formGroup.controls.maxVotesPerCard.value}
                            valueLabelDisplay="auto"
                        />
                    </Control>
                </Box>
                <Box>
                    <Typography variant="subtitle2" gutterBottom>Configurações</Typography>
                    <MuiFormGroup>
                        <FormControlLabel
                            label="Ocultar cards inicialmente"
                            control={
                                <Control
                                    type="checkbox"
                                    action="onChange"
                                    controlName="shouldHideCardsInitially"
                                >
                                    <Switch checked={formGroup.controls.shouldHideCardsInitially.value} />
                                </Control>
                            }
                        />
                        <FormControlLabel
                            label="Mostrar autor do card"
                            control={
                                <Control
                                    type="checkbox"
                                    action="onChange"
                                    controlName="shouldShowCardsAutor"
                                >
                                    <Switch checked={formGroup.controls.shouldShowCardsAutor.value} />
                                </Control>
                            }
                        />
                    </MuiFormGroup>
                    {!shouldOmitColumns && <InputColumns formGroup={formGroup} />}
                </Box>
                {children}
            </Stack>
        </Form>
    );
}